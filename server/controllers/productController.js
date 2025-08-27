import mongoose from "mongoose";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";
import Product from "../models/Product.js";

// Create Product
export const createProduct = async (req, res) => {
    try {
        let {
            productName,
            category,
            productDetails,
            price,
            sku,
            stockQuantity,
            dimensions,
            weight,
            material,
            isHandmade,
            limitedEdition,
            discountPercentage,
            isActive
        } = req.body;

        // Handle dimensions parsing for form-data
        if (!dimensions) {
            // Case 1: dot notation in form-data
            if (req.body["dimensions.height"] && req.body["dimensions.width"] && req.body["dimensions.depth"]) {
                dimensions = {
                    height: Number(req.body["dimensions.height"]),
                    width: Number(req.body["dimensions.width"]),
                    depth: Number(req.body["dimensions.depth"])
                };
            }
        } else {
            // Case 2: dimensions as JSON string
            if (typeof dimensions === "string") {
                try {
                    dimensions = JSON.parse(dimensions);
                } catch {
                    return res.status(400).json({ message: "Invalid dimensions format" });
                }
            }
        }

        // Validate required fields
        if (!productName || !category || !productDetails || !price || !sku || !weight || !dimensions) {
            return res.status(400).json({ message: "All required fields must be provided" });
        }

        // Check if SKU already exists
        const existingProduct = await Product.findOne({ sku });
        if (existingProduct) {
            return res.status(400).json({ message: "Product with this SKU already exists" });
        }

        // Upload images to Cloudinary
        let imageUrls = [];
        if (req.files && req.files.length > 0) {
            const uploadPromises = req.files.map(file => uploadToCloudinary(file.buffer, "products"));
            const uploadResults = await Promise.all(uploadPromises);
            imageUrls = uploadResults.map(result => result.secure_url);
        } else {
            return res.status(400).json({ message: "At least one product image is required" });
        }

        // Create product
        const newProduct = new Product({
            productName,
            category: new mongoose.Types.ObjectId(category),
            productDetails,
            price,
            sku,
            stockQuantity: stockQuantity || 0,
            dimensions,
            weight,
            material: material || "Terracotta",
            images: imageUrls,
            isHandmade: isHandmade !== undefined ? isHandmade : true,
            limitedEdition: limitedEdition || false,
            discountPercentage: discountPercentage || 10,
            isActive: isActive !== undefined ? isActive : true
        });

        await newProduct.save();

        res.status(201).json({
            message: "Product created successfully",
            product: newProduct
        });

    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// GET all products
export const getAllProducts = async (req, res) => {
    try {
        const query = {};

        // Category filter
        if (req.query.category) {
            query.category = req.query.category;
        }

        // Price range
        if (req.query.minPrice || req.query.maxPrice) {
            query.price = {};
            if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
            if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
        }

        // Discount
        if (req.query.discount) {
            query.discountPercentage = { $gte: Number(req.query.discount) };
        }

        // Stock
        if (req.query.inStock === "true") {
            query.stockQuantity = { $gt: 0 };
        }

        // Search (name + description)
        if (req.query.search) {
            query.$or = [
                { productName: { $regex: req.query.search, $options: "i" } },
                { description: { $regex: req.query.search, $options: "i" } }
            ];
        }

        // Handmade / Limited edition
        if (req.query.isHandmade) {
            query.isHandmade = req.query.isHandmade === "true";
        }
        if (req.query.limitedEdition) {
            query.limitedEdition = req.query.limitedEdition === "true";
        }

        // Material
        if (req.query.material) {
            query.material = req.query.material;
        }

        // Active products
        if (req.query.isActive) {
            query.isActive = req.query.isActive === "true";
        }

        // Fetch with filters
        const products = await Product.find(query).populate("category");
        res.status(200).json(products);

    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// GET product by ID
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }

        const product = await Product.findById(id).populate("category");

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json(product);
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// GET latest product limit 4
export const getLatestProduct = async (req, res) => {
    try {
        const products = await Product.find({})
            .sort({ createdAt: -1 }) // newest first
            .limit(4);               // only 4 items

        res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching latest products:", error);
        res.status(500).json({ message: "Failed to fetch latest products" });
    }
};

// GET Related Products
export const getRelatedProducts = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }

        // Fetch the main product
        const product = await Product.findById(id).populate("category");
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Find related products (same category, not the same product)
        const query = {
            _id: { $ne: product._id }, // exclude current product
            category: product.category, // same category
            isActive: true
        };

        const relatedProducts = await Product.find(query)
            .limit(8)
            .populate("category");

        res.status(200).json(relatedProducts);

    } catch (error) {
        console.error("Error fetching related products:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// UPDATE product
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }

        let updateData = { ...req.body };

        // Handle dimensions parsing
        if (req.body["dimensions.height"] || req.body["dimensions.width"] || req.body["dimensions.depth"]) {
            updateData.dimensions = {
                height: Number(req.body["dimensions.height"]),
                width: Number(req.body["dimensions.width"]),
                depth: Number(req.body["dimensions.depth"])
            };
        } else if (typeof req.body.dimensions === "string") {
            try {
                updateData.dimensions = JSON.parse(req.body.dimensions);
            } catch {
                return res.status(400).json({ message: "Invalid dimensions format" });
            }
        }

        // Keep existing images (passed from frontend)
        let images = [];
        if (req.body.existingImages) {
            // Can be single string or array
            if (Array.isArray(req.body.existingImages)) {
                images = req.body.existingImages;
            } else {
                images = [req.body.existingImages];
            }
        }

        // Upload new images if provided
        if (req.files && req.files.length > 0) {
            const uploadPromises = req.files.map(file =>
                uploadToCloudinary(file.buffer, "products")
            );
            const uploadResults = await Promise.all(uploadPromises);
            const newImages = uploadResults.map(result => result.secure_url);

            // Merge existing + new
            images = [...images, ...newImages];
        }

        updateData.images = images;

        const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({
            message: "Product updated successfully",
            product: updatedProduct
        });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// DELETE product
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }

        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// TOGGLE isActive status
export const toggleProductStatus = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        product.isActive = !product.isActive;
        await product.save();

        res.status(200).json({
            message: `Product is now ${product.isActive ? "active" : "inactive"}`,
            product
        });
    } catch (error) {
        console.error("Error toggling product status:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
