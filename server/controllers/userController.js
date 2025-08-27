import User from "../models/User.js";
import { adminNotificationTemplate, otpTemplate, welcomeTemplate } from "../utils/emailTemplates.js";
import { generateToken } from "../utils/generateToken.js";
import { hashPassword, matchPassword } from "../utils/hashPassword.js";
import { generateOtp, hashOtp, matchOtp } from "../utils/otp.js";
import { sendEmail } from "../utils/sendEmail.js";


// Register
export const registerUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) return res.status(400).json({ message: "Email & password required" });

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "User already exists" });

        const hashed = await hashPassword(password);

        const user = await User.create({ email, password: hashed });

        // Send Welcome Email
        await sendEmail({
            to: user.email,
            subject: "Welcome to MRITTIKA",
            text: `Hi ${user.email}, welcome to MRITTIKA!`,
            html: welcomeTemplate(user.email, "MRITTIKA"),
        });

        // Notify Admin about new user
        await sendEmail({
            to: process.env.ADMIN_EMAIL,
            subject: "New User Registered",
            text: `New user registered with email: ${user.email}`,
            html: adminNotificationTemplate(user.email, "MRITTIKA"),
        });

        res.status(201).json({
            _id: user._id,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } catch (err) {
        console.error("Register error:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

// Login
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && (await matchPassword(password, user.password))) {
            res.json({
                _id: user._id,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (err) {
        console.error("Login error:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

// Get Profile
export const getProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select("-password");

        if (!user) return res.status(404).json({ message: "User not found" });

        // Security: only self or admin
        if (req.user._id.toString() !== id && req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }

        res.json(user);
    } catch (err) {
        console.error("Get profile error:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

// Update profile
export const updateProfile = async (req, res) => {
    try {
        const { userId } = req.params;

        if (req.user._id.toString() !== userId && req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }

        const updated = await User.findByIdAndUpdate(
            userId,
            { $set: req.body },
            { new: true, runValidators: true }
        ).select("-password");

        res.json(updated);
    } catch (err) {
        console.error("Update profile error:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

// ADDRESS
export const addAddress = async (req, res) => {
    try {
        const { userId } = req.params;
        if (req.user._id.toString() !== userId && req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // If new address is default, set others to false
        if (req.body.isDefault === true) {
            user.addresses.forEach(addr => addr.isDefault = false);
        }


        user.addresses.push(req.body);
        await user.save();

        res.json(user.addresses);
    } catch (err) {
        console.error("Add address error:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

export const getAddresses = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId).select("addresses");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Allow only self or admin
        if (req.user._id.toString() !== userId && req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden: not your addresses" });
        }

        res.json(user.addresses);
    } catch (err) {
        console.error("Get addresses error:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

// Get a single address
export const getSingleAddress = async (req, res) => {
    try {
        const { userId, addressId } = req.params;

        const user = await User.findById(userId).select("addresses");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Allow only self or admin
        if (req.user._id.toString() !== userId && req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden: not your address" });
        }

        const address = user.addresses.id(addressId); // mongoose subdocument lookup
        if (!address) {
            return res.status(404).json({ message: "Address not found" });
        }

        res.json(address);
    } catch (err) {
        console.error("Get single address error:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

export const updateAddress = async (req, res) => {
    try {
        const { userId, addressId } = req.params;

        if (req.user._id.toString() !== userId && req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const address = user.addresses.id(addressId);
        if (!address) return res.status(404).json({ message: "Address not found" });

        // If making this address default, unset others
        if (req.body.default === true) {
            user.addresses.forEach(addr => addr.isDefault = false);
        }

        Object.assign(address, req.body);
        await user.save();

        res.json(address);
    } catch (err) {
        console.error("Update address error:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

export const deleteAddress = async (req, res) => {
    try {
        const { userId, addressId } = req.params;

        if (req.user._id.toString() !== userId && req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }

        const user = await User.findById(userId);
        const address = user.addresses.id(addressId);
        if (!address) return res.status(404).json({ message: "Address not found" });

        address.deleteOne();
        await user.save();

        res.json({ message: "Address removed" });
    } catch (err) {
        console.error("Delete address error:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

// ADMIN
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (err) {
        console.error("Get all users error:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        console.error("Get user error:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

export const toggleUserActivation = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.isActive = !user.isActive;
        await user.save();

        res.json({ message: `User ${user.isActive ? "activated" : "deactivated"}` });
    } catch (err) {
        console.error("Toggle user error:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

// Send OTP (Email)
export const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: "User not found" });

        const otp = generateOtp(6);
        user.otp = await hashOtp(otp);
        user.otpExpires = Date.now() + 10 * 60 * 1000; // valid for 10 mins
        await user.save();

        // Send OTP via Email
        await sendEmail({
            to: email,
            subject: "Password Reset OTP",
            text: `Your OTP is ${otp}. It will expire in 10 minutes.`,
            html: otpTemplate(otp, "MRITTIKA"),
        });

        res.json({ message: "OTP sent to your email" });
    } catch (err) {
        console.error("Send OTP error:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

// Resend OTP
export const resendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: "User not found" });

        const otp = generateOtp(6);
        user.otp = await hashOtp(otp);
        user.otpExpires = Date.now() + 10 * 60 * 1000;
        await user.save();

        await sendEmail({
            to: email,
            subject: "Resend OTP",
            text: `Your OTP is ${otp}. It will expire in 10 minutes.`,
            html: otpTemplate(otp, "MRITTIKA"),
        });

        res.json({ message: "OTP resent to your email" });
    } catch (err) {
        console.error("Resend OTP error:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

// Verify OTP
export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: "User not found" });
        if (!user.otp || !user.otpExpires) {
            return res.status(400).json({ message: "No OTP requested" });
        }
        if (user.otpExpires < Date.now()) {
            return res.status(400).json({ message: "OTP expired" });
        }

        const isValid = await matchOtp(otp, user.otp);
        if (!isValid) return res.status(400).json({ message: "Invalid OTP" });

        res.json({ message: "OTP verified" });
    } catch (err) {
        console.error("Verify OTP error:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

// Reset Password
export const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: "User not found" });

        // check OTP validity
        if (!user.otp || !user.otpExpires) {
            return res.status(400).json({ message: "No OTP requested" });
        }
        if (user.otpExpires < Date.now()) {
            return res.status(400).json({ message: "OTP expired" });
        }
        const isValid = await matchOtp(otp, user.otp);
        if (!isValid) return res.status(400).json({ message: "Invalid OTP" });

        // set new password
        user.password = await hashPassword(newPassword);
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.json({ message: "Password reset successful" });
    } catch (err) {
        console.error("Reset password error:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};