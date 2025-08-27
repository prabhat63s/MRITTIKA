import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = "http://localhost:8080";
// LocalStorage Helpers
const GUEST_CART_KEY = "guest_cart";

export const loadGuestCart = () => {
    try {
        const data = localStorage.getItem("guest_cart");
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
};


const saveGuestCart = (items) => {
    try {
        localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
    } catch {
        // ignore storage errors
    }
};

// Async Thunks

// Get logged-in user's cart
export const fetchCart = createAsyncThunk("cart/fetchCart", async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`${API_URL}/api/cart`, { withCredentials: true });
        return data.items || [];
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to fetch cart");
    }
});

// Add product to cart (logged-in)
export const addToCart = createAsyncThunk("cart/addToCart", async ({ productId, quantity }, { rejectWithValue }) => {
    try {
        const { data } = await axios.post(`${API_URL}/api/cart/add`, { productId, quantity }, { withCredentials: true });
        return data.items;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to add to cart");
    }
});

// Update quantity
export const updateCartQuantity = createAsyncThunk("cart/updateCartQuantity", async ({ productId, quantity }, { rejectWithValue }) => {
    try {
        const { data } = await axios.put(`${API_URL}/api/cart/update`, { productId, quantity }, { withCredentials: true });
        return data.items;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to update quantity");
    }
});

// Remove product
export const removeFromCart = createAsyncThunk("cart/removeFromCart", async (productId, { rejectWithValue }) => {
    try {
        const { data } = await axios.delete(`${API_URL}/api/cart/${productId}`, { withCredentials: true });
        return data.items;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to remove from cart");
    }
});

// Guest fetch product
export const fetchGuestProduct = createAsyncThunk("cart/fetchGuestProduct", async (productId, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`${API_URL}/api/cart/guest/${productId}`);
        return data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to fetch product");
    }
});

// Merge guest cart
export const mergeGuestCart = createAsyncThunk("cart/mergeGuestCart", async (guestItems, { rejectWithValue }) => {
    try {
        const { data } = await axios.post(`${API_URL}/api/cart/merge`, { guestItems }, { withCredentials: true });
        return data.items;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to merge guest cart");
    }
});

// Slice

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items: loadGuestCart(), // Load from localStorage if guest
        loading: false,
        error: null,
        promoCode: "",
        discount: 0,
    },

    reducers: {
        // Guest user operations (localStorage sync)
        addGuestItem: (state, action) => {
            const { productId, product, quantity } = action.payload;
            const existing = state.items.find((item) => item.product._id === productId);
            if (existing) {
                toast.success(`${product.productName} is already in your cart`);
            } else {
                state.items.push({ product, quantity });
                saveGuestCart(state.items);
            }
        },
        updateGuestQuantity: (state, action) => {
            const { productId, quantity } = action.payload;
            const existing = state.items.find((item) => item.product._id === productId);
            if (existing) existing.quantity = quantity;
            saveGuestCart(state.items);
        },
        removeGuestItem: (state, action) => {
            state.items = state.items.filter((item) => item.product._id !== action.payload);
            saveGuestCart(state.items);
        },
        clearCart: (state) => {
            state.items = [];
            saveGuestCart([]);
        },
        setPromo: (state, action) => {
            state.promoCode = action.payload.code;
            state.discount = action.payload.discount;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.items = action.payload;
            })
            .addCase(updateCartQuantity.fulfilled, (state, action) => {
                state.items = action.payload;
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.items = action.payload;
            })
            .addCase(mergeGuestCart.fulfilled, (state, action) => {
                state.items = action.payload;
                saveGuestCart([]); // clear guest cart once merged
            });
    },
});

export const { addGuestItem, updateGuestQuantity, removeGuestItem, clearCart, setPromo } = cartSlice.actions;
export default cartSlice.reducer;
