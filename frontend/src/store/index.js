import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.js';
import productReducer from './slices/productSlice.js';
import uiReducer from './slices/uiSlice.js';
import userReducer from './slices/userSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    user: userReducer,
    ui: uiReducer
  }
});
