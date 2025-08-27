import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { mergeGuestCart, loadGuestCart } from "./cartSlice";

const API_URL = "http://localhost:8080/api/users";

// Helper to set token in Axios
const setAuthToken = (token) => {
    if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete axios.defaults.headers.common["Authorization"];
    }
};

// --- Hydrate from localStorage ---
const initialToken = localStorage.getItem("token") || null;
const initialUser = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

if (initialToken) setAuthToken(initialToken);

// Helper function to merge guest cart after login/register
const mergeGuestIfNeeded = (dispatch) => {
    const guestItems = loadGuestCart();
    if (guestItems.length > 0) {
        dispatch(
            mergeGuestCart(
                guestItems.map((item) => ({
                    productId: item.product._id,
                    quantity: item.quantity,
                }))
            )
        );
    }
};

// Login
export const login = createAsyncThunk("auth/login", async (data, thunkAPI) => {
    try {
        const res = await axios.post(`${API_URL}/login`, data);
        setAuthToken(res.data.token);

        // save to localStorage
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        // merge guest cart if exists
        mergeGuestIfNeeded(thunkAPI.dispatch);

        return {
            token: res.data.token,
            user: res.data.user,
        };
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
});

// Register
export const register = createAsyncThunk("auth/register", async (data, thunkAPI) => {
    try {
        const res = await axios.post(`${API_URL}/register`, data);
        setAuthToken(res.data.token);

        // save to localStorage
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        // merge guest cart if exists
        mergeGuestIfNeeded(thunkAPI.dispatch);

        return {
            token: res.data.token,
            user: res.data.user,
        };
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
});

const authSlice = createSlice({
    name: "auth",
    initialState: {
        token: initialToken,
        user: initialUser,
        loading: false,
        success: false,
        error: null,
    },
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            setAuthToken(null);
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        },
        resetAuthState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.token;
                state.user = action.payload.user;
                state.success = true;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Register
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.token;
                state.user = action.payload.user;
                state.success = true;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { logout, resetAuthState } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectToken = (state) => state.auth.token;
export const selectUser = (state) => state.auth.user;
