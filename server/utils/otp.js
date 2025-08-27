import crypto from "crypto";
import bcrypt from "bcryptjs";

// generate numeric OTP
export const generateOtp = (length = 6) => {
    let otp = "";
    for (let i = 0; i < length; i++) otp += Math.floor(Math.random() * 10);
    return otp;
};

// hash OTP before saving
export const hashOtp = async (otp) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(otp, salt);
};

// compare OTP
export const matchOtp = async (enteredOtp, hashedOtp) => {
    return await bcrypt.compare(enteredOtp, hashedOtp);
};
