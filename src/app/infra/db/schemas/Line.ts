import mongoose, { Schema, Document } from 'mongoose'

export interface ILine extends Document {
  lines: any[]
  createdAt: Date
  updatedAt: Date
}

const LineSchema = new Schema<ILine>(
  {
    lines: [Schema.Types.Mixed],
  },
  {
    timestamps: true,
  }
)

export default mongoose.model<ILine>('Line', LineSchema)
