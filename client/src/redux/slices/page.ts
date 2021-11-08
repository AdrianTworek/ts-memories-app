import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState: number = 1

const pageSlice = createSlice({
  name: 'page',
  initialState,
  reducers: {
    setPage: (state, { payload }: PayloadAction<number>) => (state = payload),
  },
})

export const { setPage: setPageActionCreator } = pageSlice.actions

export default pageSlice.reducer
