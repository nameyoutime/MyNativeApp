import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type MovieCategory = 'now_playing' | 'upcoming' | 'popular';
export type SortOption = 'alphabetical' | 'rating' | 'release_date' | null;

interface SettingsState {
  category: MovieCategory;
  sortBy: SortOption;
}

const initialState: SettingsState = {
  category: 'now_playing',
  sortBy: null,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setCategory: (state, action: PayloadAction<MovieCategory>) => {
      state.category = action.payload;
    },
    setSortBy: (state, action: PayloadAction<SortOption>) => {
      state.sortBy = action.payload;
    },
  },
});

export const { setCategory, setSortBy } = settingsSlice.actions;
export default settingsSlice.reducer;
