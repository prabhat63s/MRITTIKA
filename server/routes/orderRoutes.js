import express from "express";
import {
    placeOrder,
    getOrderById,
    updateOrderStatus,
    updatePaymentStatus,
    getAllOrders,
    getUserOrders,
    cancelOrder
} from "../controllers/orderController.js";

import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// User
// Place a new order
router.post("/", protect, placeOrder);

// Get logged-in user's orders
router.get("/my", protect, getUserOrders);

// Cancel own order
router.patch("/:orderId/cancel", protect, cancelOrder);

// User + Admin: Get order by ID
router.get("/:orderId", protect, getOrderById);

// Admin
// Get all orders
router.get("/", protect, authorize("admin"), getAllOrders);

// Update order status (pending → shipped, etc.)
router.patch("/:orderId/status", protect, authorize("admin"), updateOrderStatus);

// Update payment status (pending → completed)
router.patch("/:orderId/payment", protect, authorize("admin"), updatePaymentStatus);

export default router;
