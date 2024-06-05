import { configureStore, createSlice, current } from '@reduxjs/toolkit'

const initialState = {
    currentUser: null,
    loading: false,
    error: null,
    updateMessage: null,
    updateStatus: null
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers:{
        signInStart: (state)=>{
            state.loading = true;
            state.error = null;
        },
        signInSuccess: (state, action)=>{
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        signInFailure: (state, action)=>{
            state.loading = false;
            state.error = action.payload;
        },
        updateStart: (state) => {
            state.loading = true;
        },
        updateSuccess: (state, action) =>{
            state.loading = false;
            state.error = false;
            state.currentUser = action.payload;
            
        },
        updateFailure: (state, action)=>{
            state.loading = false;
            state.error = action.payload;
        },
        setUpdateMessage: (state, action) => {
            state.updateMessage = action.payload;
        },
        setUpdateStatus: (state, action) => {
            state.updateStatus = action.payload;
        }   
    }
})

export const { signInStart, signInSuccess, signInFailure, updateSuccess, updateFailure
    , updateStart, updateMessage, updateStatus, setUpdateMessage, setUpdateStatus} = userSlice.actions;

export default userSlice.reducer;
