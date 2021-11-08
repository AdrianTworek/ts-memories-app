import { NextFunction, Request, Response } from 'express'
import bcrypt from 'bcrypt'
import config from 'config'
import jwt from 'jsonwebtoken'
import User, { UserDoc } from '../models/user.model'
import ApiError from '../utils/apiError'
import catchAsync from '../utils/catchAsync'

const signAndSendToken = (res: Response, statusCode: number, user: UserDoc) => {
  const token = jwt.sign({ user }, config.get('JWT_SECRET'), {
    expiresIn: config.get('JWT_EXPIRES'),
  })

  return res.status(statusCode).json({
    status: 'success',
    token,
    user: {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      memoriesNumber: user.memoriesNumber,
    },
  })
}

export const register = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { firstName, lastName, email, password, confirmPassword } = req.body

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return next(new ApiError('User with this email already exists', 409))
    }

    if (password !== confirmPassword) {
      return next(new ApiError('Passwords do not match', 400))
    }

    const user = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password,
      confirmPassword,
    })

    signAndSendToken(res, 200, user)
  }
)

export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body

    if (!email || !password) {
      return next(new ApiError('Please provide email and password', 400))
    }

    let user = await User.findOne({ email: email.toLowerCase() })

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return next(new ApiError('Invalid email or password', 401))
    }

    signAndSendToken(res, 200, user)
  }
)

export const getUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let user = await User.findOne({ _id: req.params.id })

    if (!user) {
      return next(new ApiError('User not found', 404))
    }

    signAndSendToken(res, 200, user)
  }
)
