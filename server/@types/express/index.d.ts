import { UserDoc } from '../../src/models/user.model'

declare global {
  namespace Express {
    interface Request {
      user: UserDoc
    }
  }
}
