import Order from "../models/Order.js";
import User from "../models/User.js";
import { sendEmail } from "../utils/sendEmail.js";
import {
    orderPlacedTemplate,
    adminOrderNotificationTemplate,
    orderStatusTemplate,
    paymentStatusTemplate,
} from "../utils/emailTemplates.js";


// Place Order
export const placeOrder = async (req, res) => {
    try {
        const { items, amount, paymentMode, address } = req.body;
        if (!items || items.length === 0) {
            return res.status(400).json({ message: "Order must have items" });
        }

        const order = new Order({
            userId: req.user._id,
            items,
            amount,
            paymentMode,
            address,
        });

        await order.save();

        const user = await User.findById(req.user._id);

        // Send confirmation email to user
        await sendEmail({
            to: user.email,
            subject: "Order Placed Successfully",
            html: orderPlacedTemplate(user.email, order),
        });

        // Notify admin
        await sendEmail({
            to: process.env.ADMIN_EMAIL,
            subject: "New Order Received",
            html: adminOrderNotificationTemplate(order),
        });

        res.status(201).json(order);
    } catch (err) {
        console.error("Place order error:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

// Get User Orders
export const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        console.error("Get user orders error:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

// Get Single Order
export const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id).populate("items.product", "name price");

        if (!order) return res.status(404).json({ message: "Order not found" });

        // Security check: only owner or admin
        if (req.user._id.toString() !== order.userId.toString() && req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }

        res.json(order);
    } catch (err) {
        console.error("Get order error:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

// Update Order Status (Admin)
export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const order = await Order.findById(id).populate("userId", "email");
        if (!order) return res.status(404).json({ message: "Order not found" });

        order.orderStatus = status;
        await order.save();

        // Send status update email
        await sendEmail({
            to: order.userId.email,
            subject: `Order #${order._id} Status Update`,
            html: orderStatusTemplate(order.userId.email, order),
        });

        res.json(order);
    } catch (err) {
        console.error("Update order status error:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

// Update Payment Status (Admin/Callback)
export const updatePaymentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, razorpayOrderId, razorpayPaymentId } = req.body;

        const order = await Order.findById(id).populate("userId", "email");
        if (!order) return res.status(404).json({ message: "Order not found" });

        order.paymentStatus = status;
        if (razorpayOrderId) order.razorpayOrderId = razorpayOrderId;
        if (razorpayPaymentId) order.razorpayPaymentId = razorpayPaymentId;

        await order.save();

        // Send payment status email
        await sendEmail({
            to: order.userId.email,
            subject: `Order #${order._id} Payment Update`,
            html: paymentStatusTemplate(order.userId.email, order),
        });

        res.json(order);
    } catch (err) {
        console.error("Update payment status error:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

// Cancel Order
export const cancelOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id).populate("userId", "email");

        if (!order) return res.status(404).json({ message: "Order not found" });

        // Security check: only owner or admin
        if (req.user._id.toString() !== order.userId._id.toString() && req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }

        if (order.orderStatus === "delivered") {
            return res.status(400).json({ message: "Delivered orders cannot be cancelled" });
        }

        order.orderStatus = "cancelled";
        await order.save();

        // Send cancel notification
        await sendEmail({
            to: order.userId.email,
            subject: `Order #${order._id} Cancelled`,
            html: orderStatusTemplate(order.userId.email, order),
        });

        res.json({ message: "Order cancelled", order });
    } catch (err) {
        console.error("Cancel order error:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

// Admin - Get All Orders
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate("userId", "email").sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        console.error("Get all orders error:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};
