import mongoose, { Schema, Document } from 'mongoose'

export interface IInitiative extends Document {
  user_id: number
  user: string
  initiative: number
  createdAt: Date
  updatedAt: Date
}

const InitiativeSchema = new Schema<IInitiative>(
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

export default mongoose.model<IInitiative>('Initiative', InitiativeSchema)
