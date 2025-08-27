import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// Add item to cart (for logged-in user)
export const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            cart = new Cart({ user: req.user._id, items: [] });
        }

        // Check if product already in cart
        const itemIndex = cart.items.findIndex(
            (item) => item.product.toString() === productId
        );

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
        } else {
            cart.items.push({ product: productId, quantity });
        }

        await cart.save();
        res.json(await cart.populate("items.product", "productName price images"));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get cart for logged-in user
export const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id })
            .populate("items.product", "productName price images")
            .sort({ createdAt: -1 });

        if (!cart) return res.json({ items: [] });

        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update quantity for a product in cart (logged-in user)
export const updateCartQuantity = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        if (quantity < 1) {
            return res.status(400).json({ message: "Quantity must be at least 1" });
        }

        const cart = await Cart.findOne({ user: req.user._id });

        if (!cart) return res.status(404).json({ message: "Cart not found" });

        const itemIndex = cart.items.findIndex(
            (item) => item.product.toString() === productId
        );

        if (itemIndex === -1) {
            return res.status(404).json({ message: "Product not in cart" });
        }

        cart.items[itemIndex].quantity = quantity;

        await cart.save();
        res.json(await cart.populate("items.product", "productName price images"));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Remove item from cart (logged-in user)
export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;

        const cart = await Cart.findOne({ user: req.user._id });

        if (!cart) return res.status(404).json({ message: "Cart not found" });

        cart.items = cart.items.filter(
            (item) => item.product.toString() !== productId
        );

        await cart.save();
        res.json(await cart.populate("items.product", "productName price images"));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// For guest user → just validate product data (no DB cart)
// Frontend will handle storage in localStorage
export const getGuestProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        const product = await Product.findById(productId)
        .select("productName price images")
        .sort({ createdAt: -1 });

        if (!product) return res.status(404).json({ message: "Product not found" });

        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Merge guest cart into logged-in user's cart
export const mergeGuestCart = async (req, res) => {
    try {
        const { guestItems } = req.body; // [{ productId, quantity }]

        if (!guestItems || guestItems.length === 0) {
            return res.json({ message: "No guest items to merge" });
        }

        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            cart = new Cart({ user: req.user._id, items: [] });
        }

        guestItems.forEach(({ productId, quantity }) => {
            const itemIndex = cart.items.findIndex(
                (item) => item.product.toString() === productId
            );

            if (itemIndex > -1) {
                // Already in cart → increase quantity
                cart.items[itemIndex].quantity += quantity;
            } else {
                // New product → add to cart
                cart.items.push({ product: productId, quantity });
            }
        });

        await cart.save();

        const populatedCart = await cart.populate(
            "items.product",
            "productName price images"
        );

        res.json(populatedCart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
