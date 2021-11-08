import mongoose from 'mongoose'

export interface MemoryDoc extends mongoose.Document {
  author: string
  date: string
  title: string
  description: string
  image: string
}

const memorySchema = new mongoose.Schema(
  {
    author: {
      type: String,
      required: [true, 'Please provide an author'],
      trim: true,
    },
    date: {
      type: String,
      required: [true, 'Please provide a date'],
    },
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide an description'],
      trim: true,
    },
    image: {
      type: String,
    },
    user: {
      // @ts-ignore
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Memory must belong to a user'],
    },
  },
  {
    timestamps: true,
  }
)

const Memory = mongoose.model<MemoryDoc>('Memory', memorySchema)

export default Memory
