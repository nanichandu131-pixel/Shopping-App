import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../../api/client.js';

const initialState = {
  user: null,
  status: 'idle',
  error: null,
  accessToken: localStorage.getItem('sp_access_token')
};

const apiMessage = (error) => error.response?.data?.message || error.message || 'Request failed';

export const login = createAsyncThunk('auth/login', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/login', payload);
    localStorage.setItem('sp_access_token', data.accessToken);
    localStorage.setItem('sp_refresh_token', data.refreshToken);
    return data;
  } catch (error) {
    return rejectWithValue(apiMessage(error));
  }
});

export const register = createAsyncThunk('auth/register', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/register', payload);
    localStorage.setItem('sp_access_token', data.accessToken);
    localStorage.setItem('sp_refresh_token', data.refreshToken);
    return data;
  } catch (error) {
    return rejectWithValue(apiMessage(error));
  }
});

export const loadMe = createAsyncThunk('auth/me', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/auth/me');
    return data.user;
  } catch (error) {
    return rejectWithValue(apiMessage(error));
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logoutLocal(state) {
      state.user = null;
      state.accessToken = null;
      localStorage.removeItem('sp_access_token');
      localStorage.removeItem('sp_refresh_token');
    },
    setAccessToken(state, action) {
      state.accessToken = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(register.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(loadMe.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loadMe.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(loadMe.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
        state.user = null;
        state.accessToken = null;
        localStorage.removeItem('sp_access_token');
        localStorage.removeItem('sp_refresh_token');
      });
  }
});

export const { logoutLocal, setAccessToken } = authSlice.actions;
export default authSlice.reducer;
