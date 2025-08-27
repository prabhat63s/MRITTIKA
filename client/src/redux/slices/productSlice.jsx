import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:8080/api/products";


// Get all products
export const fetchProducts = createAsyncThunk(
    "products/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(API_URL);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Get product by ID
export const fetchProductById = createAsyncThunk(
    "products/fetchById",
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${API_URL}/${id}`);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Get latest product
export const fetchLatestProduct = createAsyncThunk(
    "products/fetchLatest",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${API_URL}/latest`)
            return data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
)

// Get related products
export const fetchRelatedProducts = createAsyncThunk(
    "products/fetchRelated",
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${API_URL}/${id}/related`);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Create product (admin only)
export const createProduct = createAsyncThunk(
    "products/create",
    async ({ formData }, { getState, rejectWithValue }) => {
        try {
            const token = getState().auth.token;
            const { data } = await axios.post(API_URL, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            return data.product;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Update product (admin only)
export const updateProduct = createAsyncThunk(
    "products/update",
    async ({ id, formData }, { getState, rejectWithValue }) => {
        try {
            const token = getState().auth.token;
            const { data } = await axios.put(`${API_URL}/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            return data.product;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Delete product (admin only)
export const deleteProduct = createAsyncThunk(
    "products/delete",
    async ({ id }, { getState, rejectWithValue }) => {
        try {
            const token = getState().auth.token;
            await axios.delete(`${API_URL}/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Toggle product active/inactive (admin only)
export const toggleProductStatus = createAsyncThunk(
    "products/toggleStatus",
    async ({ id }, { getState, rejectWithValue }) => {
        try {
            const token = getState().auth.token;
            const { data } = await axios.patch(`${API_URL}/${id}/status`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return data.product;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Slice
const productSlice = createSlice({
    name: "products",
    initialState: {
        items: [],
        selected: null,
        latest: [],
        related: [],
        loading: false,
        error: null,
        filters: {
            category: "all",
            status: "all",   // active, inactive
            inStock: "all",  // inStock, outOfStock
            search: "",
        },
        filteredItems: [],
    },
    reducers: {
        setCategoryFilter: (state, action) => {
            state.filters.category = action.payload;
            state.filteredItems = applyFilters(state);
        },
        setStatusFilter: (state, action) => {
            state.filters.status = action.payload;
            state.filteredItems = applyFilters(state);
        },
        setStockFilter: (state, action) => {
            state.filters.inStock = action.payload;
            state.filteredItems = applyFilters(state);
        },
        setSearchFilter: (state, action) => {
            state.filters.search = action.payload.toLowerCase();
            state.filteredItems = applyFilters(state);
        },
        clearFilters: (state) => {
            state.filters = {
                category: "all",
                status: "all",
                inStock: "all",
                search: "",
            };
            state.filteredItems = state.items;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch All
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
                state.filteredItems = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Fetch By ID
            .addCase(fetchProductById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductById.fulfilled, (state, action) => {
                state.loading = false;
                state.selected = action.payload;
            })
            .addCase(fetchProductById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Fetch Latest
            .addCase(fetchLatestProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchLatestProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.latest = action.payload;
            })
            .addCase(fetchLatestProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch Related
            .addCase(fetchRelatedProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRelatedProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.related = action.payload;
            })
            .addCase(fetchRelatedProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Create
            .addCase(createProduct.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })

            // Update
            .addCase(updateProduct.fulfilled, (state, action) => {
                const index = state.items.findIndex((p) => p._id === action.payload._id);
                if (index !== -1) state.items[index] = action.payload;
                if (state.selected?._id === action.payload._id) {
                    state.selected = action.payload;
                }
            })

            // Delete
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.items = state.items.filter((p) => p._id !== action.payload);
            })

            // Toggle Status
            .addCase(toggleProductStatus.fulfilled, (state, action) => {
                const index = state.items.findIndex((p) => p._id === action.payload._id);
                if (index !== -1) state.items[index] = action.payload;
            });
    },
});

// Utility function to apply filters
function applyFilters(state) {
    return state.items.filter((product) => {
        const { category, status, inStock, search } = state.filters;

        let matchesCategory = category === "all" || product?.category?.name === category;
        let matchesStatus = status === "all" || (status === "active" ? product.isActive : !product.isActive);
        let matchesStock = inStock === "all" || (inStock === "inStock" ? product.stockQuantity > 0 : product.stockQuantity <= 0);
        let matchesSearch = search === "" || product.productName.toLowerCase().includes(search);

        return matchesCategory && matchesStatus && matchesStock && matchesSearch;
    });
}

export const { setCategoryFilter, setStatusFilter, setStockFilter, setSearchFilter, clearFilters } = productSlice.actions;

export default productSlice.reducer;