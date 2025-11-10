import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

// 게스트 모드 초기화
const isGuestMode = localStorage.getItem('guestMode') === 'true';
const initialState = {
  user: isGuestMode ? {
    id: 'guest',
    name: '게스트',
    email: 'guest@medical-chatbot.local',
    isGuest: true,
  } : null,
  token: isGuestMode ? 'guest-token' : (localStorage.getItem('token') || null),
  isAuthenticated: isGuestMode || !!localStorage.getItem('token'),
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: '로그인에 실패했습니다.' });
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/register', userData);
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: '회원가입에 실패했습니다.' });
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      localStorage.removeItem('guestMode');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    loginAsGuest: (state) => {
      // 게스트 모드로 로그인 - 토큰 없이 사용 가능
      localStorage.setItem('guestMode', 'true');
      state.isAuthenticated = true;
      state.user = {
        id: 'guest',
        name: '게스트',
        email: 'guest@medical-chatbot.local',
        isGuest: true,
      };
      state.token = 'guest-token';
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
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || '로그인에 실패했습니다.';
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || '회원가입에 실패했습니다.';
      });
  },
});

export const { logout, clearError, loginAsGuest } = authSlice.actions;
export default authSlice.reducer;
