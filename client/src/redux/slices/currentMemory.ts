import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CurrentMemory } from '../../type'

const initialState: CurrentMemory = {
  _id: '',
  author: '',
  date: '',
  title: '',
  description: '',
  image: '',
}

const currentMemorySlice = createSlice({
  name: 'currentMemory',
  initialState,
  reducers: {
    setCurrentMemory: (state, { payload }: PayloadAction<CurrentMemory>) =>
      (state = {
        _id: payload._id,
        author: payload.author,
        date: payload.date,
        title: payload.title,
        description: payload.description,
        image: payload.image,
      }),
    clearCurrentMemory: (state) => (state = initialState),
  },
})

export const {
  setCurrentMemory: setCurrentMemoryActionCreator,
  clearCurrentMemory: clearCurrentMemoryActionCreator,
} = currentMemorySlice.actions

export default currentMemorySlice.reducer
