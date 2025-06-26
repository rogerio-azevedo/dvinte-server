import mongoose, { Schema, Document } from 'mongoose'

export interface INotes extends Document {
  user_id: number
  user: string
  note: string
  createdAt: Date
  updatedAt: Date
}

const NotesSchema = new Schema<INotes>(
  {
    user_id: {
      type: Number,
      required: true,
    },
    user: {
      type: String,
      required: true,
    },
    note: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model<INotes>('Notes', NotesSchema)
