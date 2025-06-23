import mongoose from 'mongoose'

const InitiativeSchema = new mongoose.Schema(
  {
    user_id: {
      type: Number,
      required: true,
    },

    user: {
      type: String,
      required: true,
    },

    initiative: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('Initiative', InitiativeSchema)
