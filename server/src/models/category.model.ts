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
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Category must belong to a user'],
    },
    memories: [
      {
        type: mongoose.Schema.Types.ObjectId,
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
