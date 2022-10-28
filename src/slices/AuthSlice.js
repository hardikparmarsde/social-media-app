import { createSlice } from "@reduxjs/toolkit";


const AuthSlice = createSlice({
    name:"auth",
    initialState: {
        authdata: {}
    },
    reducers: {
        userSignedUp (state, action) {
            if(action.payload) {
                // state.authdata = action.payload;
                localStorage.setItem('profile', JSON.stringify(action.payload));   
            }
        },
        userLoggedIn (state, action) {
            if(action.payload) {
//                state.authdata = action.payload;            
            localStorage.setItem('profile', JSON.stringify(action.payload));   
            }
        },
        userLoggedOut (state, action) {
//            state.authdata = null;
            localStorage.clear();
        }
    }
})


export const { userLoggedOut, userSignedUp, userLoggedIn } = AuthSlice.actions;
export default AuthSlice.reducer;