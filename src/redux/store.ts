import { configureStore } from '@reduxjs/toolkit';
import authReducer from "./slices/auth";
import appReducer from "./slices/app";

// create store
export const store = configureStore({
    reducer: {
        auth: authReducer,
        app: appReducer
    }
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch