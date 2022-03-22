import { NextFunction, Request, Response } from 'express'
import Category from '../models/category.model'
import Memory, { MemoryDoc } from '../models/memory.model'
import User from '../models/user.model'
import ApiError from '../utils/apiError'
import catchAsync from '../utils/catchAsync'

const sendMemory = (res: Response, statusCode: number, memory: MemoryDoc) =>
  res.status(statusCode).json({ status: 'success', memory })

export const createMemory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const memory = await Memory.create(req.body)

    if (!memory) {
      return next(new ApiError('Bad request', 400))
    }

    await User.findByIdAndUpdate(req.user, { $inc: { memoriesNumber: 1 } })

    sendMemory(res, 201, memory)
  }
)

export const addMemoryToCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const category = await Category.findOne({ _id: req.body._id }).populate(
      'memories'
    )
    const memory = await Memory.findOne({ _id: req.params.id })

    if (!category || !memory) {
      return next(new ApiError('Category or memory not found', 404))
    }

    if (category && memory) {
      await Category.findByIdAndUpdate(category._id, {
        $addToSet: { memories: memory },
      })
    }

    sendMemory(res, 200, memory)
  }
)

export const removeMemoryFromCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const memory = await Memory.findOne({ _id: req.params.memoryId })
    const category = await Category.findOne({ _id: req.params.categoryId })

    if (!category || !memory) {
      return next(new ApiError('Category or memory not found', 404))
    }

    await Category.findByIdAndUpdate(category?._id, {
      $pull: { memories: memory?._id },
    })

    res.status(204).json({
      status: 'success',
    })
  }
)

export const getMemories = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let category = req.query.category || 'all'

    let page, limit, skip
    if (req.query.page) {
      page = +req.query.page
    } else {
      page = 1
    }

    if (req.query.limit) {
      limit = +req.query.limit
    } else {
      limit = 3
    }

    skip = (page - 1) * limit

    let memories, userCategory
    let idxOfFirstInCategory,
      idxOfLastInCategory = 0

    if (req.query.category && req.query.category !== 'all') {
      userCategory = await Category.findOne({
        // @ts-ignore
        user: req.user,
        // @ts-ignore
        name: category,
      }).populate('memories')
      idxOfFirstInCategory = skip
      idxOfLastInCategory = skip + limit
      memories = userCategory?.memories.splice(
        idxOfFirstInCategory,
        idxOfLastInCategory
      )
    } else {
      // Show all memories handler
      if (limit === 10) {
        memories = await Memory.find({ user: req.user }).skip(skip)
      } else {
        // Show particular number of memories
        memories = await Memory.find({ user: req.user }).skip(skip).limit(limit)
      }
    }

    if (!memories) {
      return next(new ApiError('Memories not found', 404))
    }

    res.status(200).json({
      status: 'success',
      memories,
    })
  }
)

export const getMemory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const memory = await Memory.findOne({ _id: req.params.id })

    if (!memory) {
      return next(new ApiError('Bad request', 400))
    }

    sendMemory(res, 200, memory)
  }
)

export const updateMemory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const memory = await Memory.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })

    if (!memory) {
      return next(new ApiError('Bad request', 400))
    }

    sendMemory(res, 200, memory)
  }
)

export const deleteMemory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!(await Memory.findByIdAndRemove(req.params.id))) {
      return next(new ApiError('Memory not found', 404))
    }

    // Delete memory if it was in user's favorites
    await User.findByIdAndUpdate(req.user, {
      $pull: { favorites: req.params.id },
      $inc: { memoriesNumber: -1 },
    })

    res.status(204).json({
      status: 'success',
    })
  }
)

export const getFavoriteMemories = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findOne({ _id: req.user }).populate('favorites')

    if (!user) {
      return next(new ApiError('User not found', 404))
    }

    res.status(200).json({
      status: 'success',
      favorites: user?.favorites,
    })
  }
)

export const addMemoryToFavorites = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const memory = await Memory.findOne({ _id: req.body.id })

    if (!memory) {
      return next(new ApiError('Memory not found', 404))
    }

    await User.findByIdAndUpdate(req.user, { $addToSet: { favorites: memory } })

    sendMemory(res, 200, memory)
  }
)

export const removeMemoryFromFavorites = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const memory = await Memory.findOne({ _id: req.params.id })

    if (!memory) {
      return next(new ApiError('Memory not found', 404))
    }

    await User.findByIdAndUpdate(req.user, { $pull: { favorites: memory._id } })

    res.status(204).json({
      status: 'success',
    })
  }
)
