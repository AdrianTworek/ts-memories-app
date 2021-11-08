import { createSlice } from '@reduxjs/toolkit'

const initialState: boolean = false

const editModeSlice = createSlice({
  name: 'editMode',
  initialState,
  reducers: {
    toggleEditMode: (state) => (state = true),
    toggleCreateMode: (state) => (state = false),
  },
})

export const {
  toggleEditMode: toggleEditModeActionCreator,
  toggleCreateMode: toggleCreateModeActionCreator,
} = editModeSlice.actions

export default editModeSlice.reducer
