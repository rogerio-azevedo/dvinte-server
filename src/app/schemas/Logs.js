import mongoose from 'mongoose'

const LogsSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    user_id: {
      type: Number,
      required: true,
    },
    user: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    result: {
      type: Number,
      required: true,
    },
    type: {
      type: Number,
      required: true,
    },
    isCrit: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('Logs', LogsSchema)
