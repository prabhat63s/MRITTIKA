import express from "express";
import { addToCart, getCart, removeFromCart, getGuestProduct, updateCartQuantity, mergeGuestCart } from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Logged-in user cart
router.post("/", protect, addToCart);
router.get("/", protect, getCart);
router.put("/update", protect, updateCartQuantity);
router.delete("/:productId", protect, removeFromCart);

// Guest user cart
router.get("/guest/:productId", getGuestProduct);

// Merge guest cart after login
router.post("/merge", protect, mergeGuestCart);
export default router;
