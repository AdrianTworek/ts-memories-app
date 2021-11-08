import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  getMemories,
  createMemory,
  updateMemory,
  deleteMemory,
} from '../../api'
import { CurrentMemory, Memory } from '../../type'

export const createUserMemory = createAsyncThunk(
  'memories/createUserMemory',
  async (formData: Memory) => {
    const {
      data: { memory },
    } = await createMemory({ ...formData, user: formData.user })

    return memory
  }
)

export const getUserMemories = createAsyncThunk(
  'memories/getUserMemories',
  async (options?: {
    page?: number
    limit?: number
    categoryName?: string
  }) => {
    const {
      data: { memories },
    } = await getMemories(options?.page, options?.limit, options?.categoryName)

    return memories
  }
)

export const updateUserMemory = createAsyncThunk(
  'memories/updateUserMemory',
  async (formData: CurrentMemory) => {
    const {
      data: { memory },
      // @ts-ignore
    } = await updateMemory(formData._id, {
      author: formData.author,
      date: formData.date,
      title: formData.title,
      description: formData.description,
      image: formData.image,
    })

    return memory
  }
)

export const deleteUserMemory = createAsyncThunk(
  'memories/deleteUserMemory',
  async (_id: string) => {
    await deleteMemory(_id)
  }
)

const initialState: Memory[] = []

const memorySlice = createSlice({
  name: 'memories',
  initialState,
  reducers: {
    deleteMemory: (state, { payload }) =>
      (state = state.filter((memory) => memory._id !== payload)),
    clearMemories: (state) => (state = []),
  },
  extraReducers: (builder) => {
    builder.addCase(
      createUserMemory.fulfilled,
      (state, { payload }: PayloadAction<Memory>) =>
        (state = [...state, payload])
    )

    builder.addCase(
      getUserMemories.fulfilled,
      (state, { payload }: PayloadAction<Memory[]>) => (state = payload)
    )

    builder.addCase(
      updateUserMemory.fulfilled,
      (state, { payload }: PayloadAction<Memory>) => {
        const idx = state.findIndex((memory) => memory._id === payload._id)
        if (idx !== -1) {
          state[idx].author = payload.author
          state[idx].createdAt = payload.createdAt
          state[idx].date = payload.date
          state[idx].title = payload.title
          state[idx].description = payload.description
          state[idx].image = payload.image
        }
      }
    )
  },
})

export const {
  deleteMemory: deleteMemoryActionCreator,
  clearMemories: clearMemoriesActionCreator,
} = memorySlice.actions

export default memorySlice.reducer
