import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice"

const store = configureStore({
    reducer: {
        auth : authReducer,
        // admin : adminReducer
    },
    
})

export default store