import Category from '../models/Category.js';
import { uploadToCloudinary } from '../utils/cloudinaryUpload.js';

// @desc    Create category
// @route   POST /api/categories
// @access  Admin/Manager
export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(400).json({ message: 'Name and description are required' });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const cloudResult = await uploadToCloudinary(req.file.buffer, 'categories');

    const category = await Category.create({
      name,
      description,
      image: cloudResult.secure_url,
      isActive: true,
    });

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Admin/Manager
export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    if (req.file) {
      const cloudResult = await uploadToCloudinary(req.file.buffer, 'categories');
      category.image = cloudResult.secure_url;
    }

    category.name = req.body.name || category.name;
    category.description = req.body.description || category.description;

    await category.save();
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Admin/Manager
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    await category.deleteOne();
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle category active/inactive
// @route   PATCH /api/categories/:id/toggle
// @access  Admin/Manager
export const toggleCategoryActivation = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    category.isActive = !category.isActive;
    await category.save();

    res.json({ message: `Category ${category.isActive ? 'activated' : 'deactivated'}`, category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
