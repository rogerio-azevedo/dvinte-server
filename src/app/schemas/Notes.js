import mongoose from 'mongoose'

const NotesSchema = new mongoose.Schema(
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

export default mongoose.model('Notes', NotesSchema)
