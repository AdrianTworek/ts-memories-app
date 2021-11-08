import { NextFunction, Request, Response } from 'express'
import ApiError from '../utils/apiError'

const apiErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).send(err.message)
  }

  res.status(500).send('Something went wrong...')
}

export default apiErrorHandler
