export interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  memoriesNumber: number
}

interface Profile {
  status: string
  token: string
  user: User
  error?: boolean
  errorMsg?: string
}

export interface Memory {
  _id: string
  user?: string
  author: string
  createdAt?: number
  date: string
  title: string
  description: string
  image?: string
}

export interface CurrentMemory {
  _id?: string
  user?: string
  author: string
  date: string
  title: string
  description: string
  image?: string
}

export interface Category {
  _id: string
  name: string
  user: string
  memories: Memory[]
}

export interface FormModeState {
  isSignUp: boolean
  isEdit: boolean
}

export interface DrawerState {
  isDrawer: boolean
}

export interface AuthFormData {
  firstName?: string
  lastName?: string
  email: string
  password: string
  confirmPassword?: string
}

export interface ProfileState {
  profile: {
    status: string
    token: string
    user: User
    error: boolean
    errorMsg?: string
  }
}

export interface MemoryFormData {
  author: ''
  date: ''
  title: ''
  description: ''
  image: ''
}

export interface CurrentMemoryState {
  currentMemory: CurrentMemory
}

export interface MemoryState {
  memories: Memory[]
}

export interface FavoritesState {
  favorites: Memory[]
}

export interface CategoryState {
  categories: Category[]
}

export interface SelectedCategoryState {
  selectedCategory: string
}

export interface MemoriesLoadingState {
  memoriesLoading: boolean
}
