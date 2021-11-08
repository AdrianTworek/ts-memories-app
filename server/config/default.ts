import dotenv from 'dotenv'

dotenv.config()

export default {
  PORT: process.env.PORT,
  DB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES: process.env.JWT_EXPIRES
}
