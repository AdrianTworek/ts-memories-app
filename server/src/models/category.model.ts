import mongoose from 'mongoose'

export interface CategoryDoc extends mongoose.Document {
  name: string
  user: string
  memories: []
}

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category must have a name'],
    },
    user: {
      // @ts-ignore
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Category must belong to a user'],
    },
    memories: [
      {
        // @ts-ignore
        type: mongoose.Schema.ObjectId,
        ref: 'Memory',
      },
    ],
  },
  {
    timestamps: true,
  }
)

const Category = mongoose.model<CategoryDoc>('Category', categorySchema)

export default Category
