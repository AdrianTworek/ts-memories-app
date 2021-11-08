import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState: string = 'all'

const selectedCategorySlice = createSlice({
  name: 'selectedCategory',
  initialState,
  reducers: {
    setCurrentCategory: (state, { payload }: PayloadAction<string>) =>
      (state = payload),
  },
})

export const { setCurrentCategory: setCurrentCategoryActionCreator } =
  selectedCategorySlice.actions

export default selectedCategorySlice.reducer
