import express from 'express';
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  toggleCategoryActivation
} from '../controllers/categoryController.js';

import { protect, authorize } from '../middleware/authMiddleware.js';
import { fileUpload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getCategories);
router.get('/:id', getCategoryById);

// Admin routes
router.post('/', protect, authorize('admin'), fileUpload('image'), createCategory);
router.put('/:id', protect, authorize('admin'), fileUpload('image'), updateCategory);
router.delete('/:id', protect, authorize('admin'), deleteCategory);
router.patch('/:id/toggle', protect, authorize('admin'), toggleCategoryActivation);

export default router;
