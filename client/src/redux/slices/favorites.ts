import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { addToFavorites, getFavorites, removeFromFavorites } from '../../api'
import { Memory } from '../../type'

const initialState: Memory[] = []

export const getFavoriteMemories = createAsyncThunk(
  'favorites/getFavoriteMemories',
  async () => {
    const {
      data: { favorites },
    } = await getFavorites()

    return favorites
  }
)

export const addMemoryToFavorites = createAsyncThunk(
  'favorites/addMemoryToFavorites',
  async (id: string) => {
    const {
      data: { memory },
    } = await addToFavorites(id)

    return memory
  }
)

export const removeFavoriteMemory = createAsyncThunk(
  'favorites/removeFavoriteMemory',
  async (_id: string) => {
    await removeFromFavorites(_id)
    return _id
  }
)

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    deleteFromFavorites: (state, { payload }) =>
      (state = state.filter((memory) => memory._id !== payload)),
    clearFavorites: (state) => (state = []),
  },
  extraReducers: (builder) => {
    builder.addCase(
      addMemoryToFavorites.fulfilled,
      (state, { payload }: PayloadAction<Memory>) => {
        state.push(payload)
      }
    )
    builder.addCase(
      getFavoriteMemories.fulfilled,
      (state, { payload }: PayloadAction<Memory[]>) => (state = payload)
    )
    builder.addCase(
      removeFavoriteMemory.fulfilled,
      (state, { payload }: PayloadAction<string>) =>
        (state = state.filter((memory) => memory._id !== payload))
    )
  },
})

export const {
  deleteFromFavorites: deleteFromFavoritesActionCreator,
  clearFavorites: clearFavoritesActionCreator,
} = favoritesSlice.actions

export default favoritesSlice.reducer
