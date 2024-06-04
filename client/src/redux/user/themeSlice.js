import {createSlice} from '@reduxjs/toolkit';

const initialState = { 
    theme: 'dark'
};

const themeSlice = createSlice({
    name: 'light',
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.theme = (state.theme === 'light' ? 'dark' : 'light');
        }
    }
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;