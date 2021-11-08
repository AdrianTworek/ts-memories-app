import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcrypt'

export interface UserDoc extends mongoose.Document {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  memoriesNumber: number
  favorites: []
  categories: []
}

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'Please provide your first name'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Please provide your last name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide a valid email'],
      trim: true,
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      trim: true,
      minlength: [6, 'Your password must contain at least 6 characters'],
    },
    confirmPassword: {
      type: String,
      required: true,
      trim: true,
      // validate: {
      //   validator: function(confirmPassword: string): boolean {
      //     return confirmPassword === this.password
      //   }
      // }
    },
    memoriesNumber: {
      type: Number,
      default: 0,
    },
    favorites: [
      {
        // @ts-ignore
        type: mongoose.Schema.ObjectId,
        ref: 'Memory',
        default: [],
      },
    ],
    categories: [
      {
        // @ts-ignore
        type: mongoose.Schema.ObjectId,
        ref: 'Category',
        default: [],
      },
    ],
  },
  {
    timestamps: true,
  }
)

userSchema.pre('save', async function () {
  this.password = await bcrypt.hash(this.password, 12)
  this.confirmPassword = undefined
})

const User = mongoose.model<UserDoc>('User', userSchema)

export default User
