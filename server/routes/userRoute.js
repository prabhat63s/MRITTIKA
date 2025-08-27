import express from "express";
import {
    addAddress,
    deleteAddress,
    getAddresses,
    getAllUsers,
    getProfile,
    getSingleAddress,
    getUserById,
    loginUser,
    registerUser,
    resendOtp,
    resetPassword,
    sendOtp,
    toggleUserActivation,
    updateAddress,
    updateProfile,
    verifyOtp,
} from "../controllers/userController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

//  Public routes 
router.post("/register", registerUser);
router.post("/login", loginUser);

// Forgot password (OTP flow)
router.post("/forgot-password/send-otp", sendOtp);
router.post("/forgot-password/verify-otp", verifyOtp);
router.post("/forgot-password/reset-password", resetPassword);
router.post("/forgot-password/resend-otp", resendOtp);

//  User routes (protected) 
router.get("/profile/:id", protect, getProfile);
router.put("/profile/:userId", protect, updateProfile);

//  Address routes 
router.get("/:userId/addresses", protect, getAddresses);
router.post("/:userId/addresses", protect, addAddress);
router.get("/:userId/addresses/:addressId", protect, getSingleAddress);
router.put("/:userId/addresses/:addressId", protect, updateAddress);
router.delete("/:userId/addresses/:addressId", protect, deleteAddress);

//  Admin routes 
router.get("/admin/all", protect, authorize("admin"), getAllUsers);
router.get("/admin/:userId", protect, authorize("admin"), getUserById);
router.patch("/admin/:userId/toggle", protect, authorize("admin"), toggleUserActivation);

export default router;
