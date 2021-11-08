import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  createCategory,
  getCategories,
  deleteCategory,
  updateCategory,
  addMemoryToCategory,
  removeMemoryFromCategories,
} from '../../api'
import { Category } from '../../type'

const initialState: Category[] = []

export const createUserCategory = createAsyncThunk(
  'categories/createUserCategory',
  async (name: string) => {
    const {
      data: { category },
    } = await createCategory(name)
    return category
  }
)

export const addUserMemoryToCategory = createAsyncThunk(
  'categories/addUserMemoryToCategory',
  async (data: { _id: string; categoryId: string }) => {
    const {
      data: { memory },
    } = await addMemoryToCategory(data._id, data.categoryId)
    return { memory, categoryId: data.categoryId }
  }
)

export const removeUserMemoryFromCategory = createAsyncThunk(
  'categories/removeUserMemoryFromCategory',
  async (data: { _id: string; categoryId: string }) => {
    await removeMemoryFromCategories(data._id, data.categoryId)
    return { memory: data._id, categoryId: data.categoryId }
  }
)

export const getUserCategories = createAsyncThunk(
  'categories/getUserCategories',
  async () => {
    const {
      data: { categories },
    } = await getCategories()
    return categories
  }
)

export const updateUserCategory = createAsyncThunk(
  'categories/updateUserCategory',
  async (data: { _id: string; name: string }) => {
    await updateCategory(data._id, data.name)
    return data
  }
)

export const deleteUserCategory = createAsyncThunk(
  'categories/deleteUserCategory',
  async (_id: string) => {
    await deleteCategory(_id)
    return _id
  }
)

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearCategories: (state) => (state = []),
  },
  extraReducers: (builder) => {
    builder.addCase(createUserCategory.fulfilled, (state, { payload }) => {
      state.push(payload)
    })

    builder.addCase(addUserMemoryToCategory.fulfilled, (state, { payload }) => {
      const category = state.find(
        (category) => category._id === payload.categoryId
      )
      category?.memories.push(payload.memory)
    })

    builder.addCase(
      removeUserMemoryFromCategory.fulfilled,
      (state, { payload }) => {
        const category = state.find(
          (category) => category._id === payload.categoryId
        )
        // @ts-ignore
        category.memories = category?.memories.filter(
          // @ts-ignore
          (memory) => memory._id !== payload.memory
        )
      }
    )

    builder.addCase(
      getUserCategories.fulfilled,
      (state, { payload }) => (state = payload)
    )

    builder.addCase(updateUserCategory.fulfilled, (state, { payload }) => {
      const category = state.find((category) => category._id === payload._id)
      if (category) {
        category.name = payload.name
      }
    })

    builder.addCase(
      deleteUserCategory.fulfilled,
      (state, { payload }) =>
        (state = state.filter((category) => category._id !== payload))
    )
  },
})

export const { clearCategories: clearCategoriesActionCreator } =
  categorySlice.actions

export default categorySlice.reducer
