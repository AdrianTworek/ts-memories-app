import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState: number = +localStorage.getItem('limit')! || 3

const limitSlice = createSlice({
  name: 'limit',
  initialState,
  reducers: {
    setLimit: (state, { payload }: PayloadAction<number>) => {
      localStorage.setItem('limit', String(payload))
      return (state = payload)
    },
  },
})

export const { setLimit: setLimitActionCreator } = limitSlice.actions

export default limitSlice.reducer
