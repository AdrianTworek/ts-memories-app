import { NextFunction, Request, Response } from 'express'
import Category, { CategoryDoc } from '../models/category.model'
import User from '../models/user.model'
import ApiError from '../utils/apiError'
import catchAsync from '../utils/catchAsync'

const sendCategory = (
  res: Response,
  statusCode: number,
  category: CategoryDoc
) => res.status(statusCode).json({ status: 'success', category })

export const createCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    const user = await User.findOne({ _id: req.user })

    const category = await Category.create({
      name: req.body.name,
      user,
    })

    if (!user || !category) {
      return next(new ApiError('User or category not found', 404))
    }

    // @ts-ignore
    await User.findByIdAndUpdate(req.user, {
      $addToSet: { categories: category },
    })

    sendCategory(res, 201, category)
  }
)

export const getCategories = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const user = await User.findOne({ _id: req.user }).populate({
      path: 'categories',
      populate: [
        {
          path: 'memories',
          model: 'Memory',
        },
      ],
    })

    let categories
    if (user) {
      categories = user.categories
    }

    res.status(200).json({
      status: 'success',
      categories,
    })
  } catch (error) {
    res.status(404).send('Not found')
  }
}

export const editCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })

    if (!category) {
      return next(new ApiError('Category not found', 404))
    }

    sendCategory(res, 200, category)
  }
)

export const deleteCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!(await Category.findByIdAndRemove(req.params.id))) {
      return next(new ApiError('Category not found', 404))
    }

    // @ts-ignore
    await User.findByIdAndUpdate(req.user, {
      $pull: { categories: req.params.id },
    })

    res.status(204).json({
      status: 'success',
    })
  }
)
