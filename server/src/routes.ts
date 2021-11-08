import { Express, Request, Response } from 'express'
import {
  getCategories,
  createCategory,
  deleteCategory,
  editCategory,
} from './controllers/category.controller'
import {
  createMemory,
  getMemories,
  getMemory,
  updateMemory,
  deleteMemory,
  addMemoryToFavorites,
  getFavoriteMemories,
  removeMemoryFromFavorites,
  addMemoryToCategory,
  removeMemoryFromCategory,
} from './controllers/memory.controller'
import { register, login, getUser } from './controllers/user.controller'
import requiresUser from './middleware/requiresUser'

export default (app: Express) => {
  app.get('/api', (req: Request, res: Response) =>
    res.send('Welcome to memories-app')
  )

  // Auth routes
  app.post('/api/register', register)
  app.post('/api/login', login)

  // User routes
  app.use(requiresUser)
  app.get('/api/users/:id', getUser)

  // Memories routes
  app.post('/api/memories', createMemory)
  app.post('/api/memories/:id', addMemoryToCategory)
  app.get('/api/memories', getMemories)
  app.get('/api/memories/:id', getMemory)
  app.patch('/api/memories/:id', updateMemory)
  app.delete('/api/memories/:id', deleteMemory)
  app.delete('/api/memories/:memoryId/:categoryId', removeMemoryFromCategory)

  // Favorites routes
  app.post('/api/favorites', addMemoryToFavorites)
  app.get('/api/favorites', getFavoriteMemories)
  app.delete('/api/favorites/:id', removeMemoryFromFavorites)

  // Categories routes
  app.get('/api/categories', getCategories)
  app.post('/api/categories', createCategory)
  app.patch('/api/categories/:id', editCategory)
  app.delete('/api/categories/:id', deleteCategory)
}
