import axios from 'axios'
import { AuthFormData, Memory } from '../type'

const API = axios.create({
  baseURL: 'https://ts-memories-app.herokuapp.com',
})

API.interceptors.request.use((req) => {
  if (localStorage.getItem('profile')) {
    req.headers.authorization = `Bearer ${
      JSON.parse(localStorage.getItem('profile') as string).token
    }`
  }
  return req
})

// Auth actions
export const register = (formData: AuthFormData) =>
  API.post('/api/register', formData)
export const login = (formData: AuthFormData) =>
  API.post('/api/login', formData)

// Users actions
export const getUser = (id: string) => API.get(`/api/users/${id}`)

// Memories CRUD actions
export const createMemory = (formData: Memory) =>
  API.post('/api/memories', formData)
export const addMemoryToCategory = (memoryId: string, categoryId: string) =>
  API.post(`/api/memories/${memoryId}`, { _id: categoryId })
export const getMemories = (
  page: number = 1,
  limit: number = 3,
  categoryName: string = 'all'
) =>
  API.get(`/api/memories?page=${page}&limit=${limit}&category=${categoryName}`)
export const updateMemory = (id: string, formData: Memory) =>
  API.patch(`/api/memories/${id}`, formData)
export const deleteMemory = (id: string) => API.delete(`/api/memories/${id}`)
export const removeMemoryFromCategories = (
  memoryId: string,
  categoryId: string
) => API.delete(`api/memories/${memoryId}/${categoryId}`)

// Favorite memories actions
export const getFavorites = () => API.get('/api/favorites')
export const addToFavorites = (id: string) => API.post('/api/favorites', { id })
export const removeFromFavorites = (id: string) =>
  API.delete(`/api/favorites/${id}`)

// Categories actions
export const createCategory = (name: string) =>
  API.post('/api/categories', { name })
export const getCategories = () => API.get('/api/categories')
export const updateCategory = (id: string, name: string) =>
  API.patch(`/api/categories/${id}`, { name })
export const deleteCategory = (id: string) =>
  API.delete(`/api/categories/${id}`)
