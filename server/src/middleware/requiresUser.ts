import { NextFunction, Request, Response } from 'express'
import config from 'config'
import jwt from 'jsonwebtoken'

const requiresUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]

    if (token) {
      let decodedData = jwt.verify(token, config.get('JWT_SECRET'))

      // @ts-ignore
      req.user = decodedData?.user?._id
    }

    next()
  } catch (error) {
    console.log(error)
  }
}

export default requiresUser
