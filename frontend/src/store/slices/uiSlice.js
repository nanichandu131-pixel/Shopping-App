import { createSlice } from '@reduxjs/toolkit';

const preferred = localStorage.getItem('sp_theme') || 'light';
document.documentElement.classList.toggle('dark', preferred === 'dark');

const uiSlice = createSlice({
  name: 'ui',
  initialState: { theme: preferred },
  reducers: {
    toggleTheme(state) {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('sp_theme', state.theme);
      document.documentElement.classList.toggle('dark', state.theme === 'dark');
    }
  }
});

export const { toggleTheme } = uiSlice.actions;
export default uiSlice.reducer;
