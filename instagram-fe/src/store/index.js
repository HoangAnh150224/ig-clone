import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import postReducer from "./slices/postSlice";
import userReducer from "./slices/userSlice";
import exploreReducer from "./slices/exploreSlice";
import uiReducer from "./slices/uiSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        posts: postReducer,
        user: userReducer,
        explore: exploreReducer,
        ui: uiReducer,
    },
});

export default store;
