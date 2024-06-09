import { configureStore, createSlice, current } from '@reduxjs/toolkit'
import { signout } from '../../../../api/controllers/user.controller';

const initialState = {
    currentUser: null,
    loading: false,
    error: null,
    updateMessage: null,
    updateStatus: null,
    messageTime: Number(5),
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        signInSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        signInFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        updateStart: (state) => {
            state.loading = true;
        },
        updateSuccess: (state, action) => {
            state.loading = false;
            state.error = false;
            state.currentUser = action.payload;
        },
        updateFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        setUpdateMessage: (state, action) => {
            state.updateMessage = action.payload;
        },
        setUpdateStatus: (state, action) => {
            state.updateStatus = action.payload;
        },
        setMessageTime: (state, action) => {
            state.messageTime = action.payload;
        },
        deleteUserStart: (state) => {
            state.loading = true;
        },
        deleteUserSuccess: (state) => {
            state.loading = false;
            state.error = false;
            state.currentUser = null;
        },
        deleteUserFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        signoutStart: (state) => {
            state.currentUser = null;
        },
        signoutSuccess: (state) => {
            state.currentUser = null;
        },
        signoutFailure: (state, action) => {
            state.error = action.payload;
        }
    }
})

export const { signInStart, signInSuccess, signInFailure, updateSuccess, updateFailure
    , updateStart, updateMessage, updateStatus, setUpdateMessage, setUpdateStatus, deleteUserFailure, deleteUserSuccess, deleteUserStart, signoutFailure, signoutStart, signoutSuccess, setMessageTime } = userSlice.actions;

export default userSlice.reducer;
