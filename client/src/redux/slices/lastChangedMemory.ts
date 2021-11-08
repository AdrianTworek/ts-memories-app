import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState: string = ''

// This state keeps track of the last added to the favorites
// memory to fix some UI bugs displaying Snackbar component

const lastChangedMemorySlice = createSlice({
  name: 'lastChangedMemory',
  initialState,
  reducers: {
    setLastChangedMemory: (state, { payload }: PayloadAction<string>) =>
      (state = payload),
  },
})

export const { setLastChangedMemory: setLastChangedMemoryActionCreator } =
  lastChangedMemorySlice.actions

export default lastChangedMemorySlice.reducer
