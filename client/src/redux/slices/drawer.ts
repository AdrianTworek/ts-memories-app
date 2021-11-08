import { createSlice } from '@reduxjs/toolkit'

const initialState: boolean = false

const drawerSlice = createSlice({
  name: 'drawer',
  initialState,
  reducers: {
    showDrawer: (state) => (state = true),
    hideDrawer: (state) => (state = false),
  },
})

export const {
  showDrawer: showDrawerActionCreator,
  hideDrawer: hideDrawerActionCreator,
} = drawerSlice.actions

export default drawerSlice.reducer
