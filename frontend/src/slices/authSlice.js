import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status : false,
    userInfo : localStorage.getItem('revShopUser')
    ? JSON.parse(localStorage.getItem('revShopUser')) : null,
}


const authSlice = createSlice({
    name : 'auth',
    initialState,
    reducers : {
        setCredentials : (state, action) => {
            state.status = true;
            state.userInfo = action.payload;
            localStorage.setItem('revShopUser', JSON.stringify(action.payload));
        },
        logout : (state) => {
            state.status = false;
            state.userInfo = null;
            localStorage.removeItem('revShopUser');
        }
    }
})

export const {setCredentials, logout} = authSlice.actions;
export default authSlice.reducer;