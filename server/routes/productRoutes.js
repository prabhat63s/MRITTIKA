import express from "express";
import { createProduct, deleteProduct, getAllProducts, getLatestProduct, getProductById, getRelatedProducts, toggleProductStatus, updateProduct } from "../controllers/productController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
import { fileUpload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllProducts);
router.get("/latest", getLatestProduct);
router.get("/:id", getProductById);
router.get("/:id/related", getRelatedProducts);

// Admin routes
router.post('/', protect, authorize('admin'), fileUpload('images', 6), createProduct);
router.put("/:id", protect, authorize('admin'), fileUpload("images", 6), updateProduct);
router.delete("/:id", protect, authorize('admin'), deleteProduct);
router.patch("/:id/status", protect, authorize('admin'), toggleProductStatus);

export default router;
