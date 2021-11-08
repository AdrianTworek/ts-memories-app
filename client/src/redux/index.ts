import { configureStore, combineReducers } from '@reduxjs/toolkit'
import {
  authReducer,
  signupModeReducer,
  editModeReducer,
  currentMemoryReducer,
  memoryReducer,
  favoritesReducer,
  categoryReducer,
  drawerReducer,
  selectedCategoryReducer,
  pageReducer,
  limitReducer,
  lastChangedMemoryReducer,
  memoriesLoadingReducer,
} from './slices'

const reducer = combineReducers({
  isSignUp: signupModeReducer,
  isEdit: editModeReducer,
  profile: authReducer,
  memories: memoryReducer,
  memoriesLoading: memoriesLoadingReducer,
  currentMemory: currentMemoryReducer,
  favorites: favoritesReducer,
  categories: categoryReducer,
  isDrawer: drawerReducer,
  selectedCategory: selectedCategoryReducer,
  page: pageReducer,
  limit: limitReducer,
  lastChangedMemory: lastChangedMemoryReducer,
})

export default configureStore({ reducer })
