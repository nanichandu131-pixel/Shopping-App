import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../../api/client.js';

export const fetchWishlist = createAsyncThunk('user/wishlist', async () => {
  const { data } = await api.get('/wishlist');
  return data.items;
});

export const fetchNotifications = createAsyncThunk('user/notifications', async () => {
  const { data } = await api.get('/users/notifications');
  return data.items;
});

export const fetchAlerts = createAsyncThunk('user/alerts', async () => {
  const { data } = await api.get('/alerts');
  return data.items;
});

const userSlice = createSlice({
  name: 'user',
  initialState: {
    wishlist: [],
    notifications: [],
    alerts: [],
    status: 'idle'
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.wishlist = action.payload;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.notifications = action.payload;
      })
      .addCase(fetchAlerts.fulfilled, (state, action) => {
        state.alerts = action.payload;
      });
  }
});

export default userSlice.reducer;
