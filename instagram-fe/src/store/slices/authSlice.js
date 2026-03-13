import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../../services/authService";

export const login = createAsyncThunk(
    "auth/login",
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await authService.login(credentials);
            return response;
        } catch (error) {
            return rejectWithValue(
                error.apiResponse || error.message || "Login failed",
            );
        }
    },
);

export const signup = createAsyncThunk(
    "auth/signup",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await authService.signup(userData);
            return response;
        } catch (error) {
            return rejectWithValue(
                error.apiResponse || error.message || "Signup failed",
            );
        }
    },
);

export const fetchCurrentUser = createAsyncThunk(
    "auth/fetchCurrentUser",
    async (_, { rejectWithValue }) => {
        try {
            const response = await authService.getCurrentUser();
            return response;
        } catch (error) {
            return rejectWithValue(
                error.apiResponse || error.message || "Session expired",
            );
        }
    },
);

const getStoredUser = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.id === "1") {
        user.id = "u-001";
        localStorage.setItem("user", JSON.stringify(user));
    }
    return user;
};

const initialState = {
    user: getStoredUser() || null,
    token: null,
    isAuthenticated: !!getStoredUser(),
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem("user");
        },
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                const { accessToken, ...userData } = action.payload;
                state.user = userData;
                state.token = accessToken;
                localStorage.setItem("user", JSON.stringify(userData));
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(signup.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signup.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                const { accessToken, ...userData } = action.payload;
                state.user = userData;
                state.token = accessToken;
                localStorage.setItem("user", JSON.stringify(userData));
            })
            .addCase(signup.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchCurrentUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCurrentUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload;
                localStorage.setItem("user", JSON.stringify(action.payload));
            })
            .addCase(fetchCurrentUser.rejected, (state) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
                localStorage.removeItem("user");
            });
    },
});

export const { logout, setUser, clearError } = authSlice.actions;
export default authSlice.reducer;
