import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  isAuthenticated: boolean;
  userId: string | null;
  username: string | null;
  apiKey: string;
}

const initialState: UserState = {
  isAuthenticated: false,
  userId: null,
  username: null,
  apiKey: 'test',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ userId: string; username: string }>) => {
      state.isAuthenticated = true;
      state.userId = action.payload.userId;
      state.username = action.payload.username;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.userId = null;
      state.username = null;
    },
    updateApiKey: (state, action: PayloadAction<string>) => {
      state.apiKey = action.payload;
    },
  },
});

export const { login, logout, updateApiKey } = userSlice.actions;
export default userSlice.reducer;