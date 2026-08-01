import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../../api/client.js';

export const searchProducts = createAsyncThunk('products/search', async (params) => {
  const { data } = await api.get('/products', { params });
  return data;
});

export const fetchProduct = createAsyncThunk('products/fetchOne', async (id) => {
  const { data } = await api.get(`/products/${id}`);
  return data;
});

export const fetchComparison = createAsyncThunk('products/compare', async (id) => {
  const { data } = await api.get(`/comparisons/${id}`);
  return data;
});

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    providerResults: [],
    selected: null,
    comparison: null,
    meta: null,
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(searchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.items || [];
        state.providerResults = action.payload.providerResults || [];
        state.meta = action.payload.meta;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.selected = action.payload;
      })
      .addCase(fetchComparison.fulfilled, (state, action) => {
        state.comparison = action.payload;
      });
  }
});

export default productSlice.reducer;
