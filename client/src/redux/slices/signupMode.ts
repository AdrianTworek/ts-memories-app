import { createSlice } from '@reduxjs/toolkit'

const initialState: boolean = true

const signupModeSlice = createSlice({
  name: 'signupMode',
  initialState,
  reducers: {
    toggleSignUpMode: (state) => (state = true),
    toggleSignInMode: (state) => (state = false),
  },
})

export const {
  toggleSignUpMode: toggleSignUpActionCreator,
  toggleSignInMode: toggleSignInActionCreator,
} = signupModeSlice.actions

export default signupModeSlice.reducer
