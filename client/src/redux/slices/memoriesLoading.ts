import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState: boolean = false

const memoriesLoadingSlice = createSlice({
  name: 'memoriesLoading',
  initialState,
  reducers: {
    setMemoriesLoading: (state, { payload }: PayloadAction<boolean>) =>
      (state = payload),
  },
})

export const { setMemoriesLoading: setMemoriesLoadingActionCreator } =
  memoriesLoadingSlice.actions

export default memoriesLoadingSlice.reducer
