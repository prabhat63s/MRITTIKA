import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:8080";

// Get all categories
export const fetchCategories = createAsyncThunk(
    "categories/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.get(`${API_URL}/api/categories`);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

// Get category by ID
export const fetchCategoryById = createAsyncThunk(
    "categories/fetchCategoryById",
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${API_URL}/api/categories/${id}`);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Create category
export const createCategory = createAsyncThunk(
    "categories/create",
    async (formData, { rejectWithValue, getState }) => {
        try {
            const token = getState().auth.token;
            const res = await axios.post(`${API_URL}/api/categories`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

// Update category
export const updateCategory = createAsyncThunk(
    "categories/updateCategory",
    async ({ id, formData }, { rejectWithValue, getState }) => {
        try {
            const token = getState().auth.token;
            const { data } = await axios.put(`${API_URL}/api/categories/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });
            return data.category;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Delete category
export const deleteCategory = createAsyncThunk(
    "categories/delete",
    async (id, { getState, rejectWithValue }) => {
        try {
            const token = getState().auth.token;
            await axios.delete(`${API_URL}/api/categories/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

// Toggle isActive status
export const toggleCategoryActive = createAsyncThunk(
    "categories/toggleCategoryActive",
    async (id, { rejectWithValue, getState }) => {
        try {
            const token = getState().auth.token;
            const { data } = await axios.patch(
                `${API_URL}/api/categories/${id}/toggle`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            return data.category;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const categorySlice = createSlice({
    name: "categories",
    initialState: { items: [], loading: false, error: null, singleCategory: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch categories
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch by ID
            .addCase(fetchCategoryById.fulfilled, (state, action) => {
                state.singleCategory = action.payload;
            })

            // Create category
            .addCase(createCategory.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            .addCase(createCategory.rejected, (state, action) => {
                state.error = action.payload;
            })

            // Update
            .addCase(updateCategory.fulfilled, (state, action) => {
                state.items = state.items.map((c) =>
                    c._id === action.payload._id ? action.payload : c
                );
            })

            // Delete category
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.items = state.items.filter((cat) => cat._id !== action.payload);
            })
            .addCase(deleteCategory.rejected, (state, action) => {
                state.error = action.payload;
            })

            // Toggle Active
            .addCase(toggleCategoryActive.fulfilled, (state, action) => {
                state.items = state.items.map((c) =>
                    c._id === action.payload._id ? action.payload : c
                );
            });
    },
});

export default categorySlice.reducer;
