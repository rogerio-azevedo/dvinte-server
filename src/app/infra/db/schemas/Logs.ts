import mongoose, { Schema, Document } from 'mongoose'

export interface ILogs extends Document {
  id?: number
  user_id?: number
  user: string
  message: string
  result?: number
  type?: number
  isCrit?: string
  createdAt: Date
  updatedAt: Date
}

const LogsSchema = new Schema<ILogs>(
  {
    id: {
      type: Number,
      required: false,
    },
    user_id: {
      type: Number,
      required: false,
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
      required: false,
      default: 0,
    },
    type: {
      type: Number,
      required: false,
      default: 1,
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

export default mongoose.model<ILogs>('Logs', LogsSchema)
