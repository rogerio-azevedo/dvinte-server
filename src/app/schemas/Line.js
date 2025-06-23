import mongoose from 'mongoose'

const LineSchema = new mongoose.Schema(
  {
    lines: {
      type: Array,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('Line', LineSchema)
