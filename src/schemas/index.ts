import mongoose from 'mongoose'

// Import schemas
import '../app/schemas/Logs.js'
import '../app/schemas/Initiative.js'
import '../app/schemas/Notes.js'
import '../app/schemas/Line.js'

// Export models with proper typing
export const Logs = mongoose.model('Logs')
export const Initiative = mongoose.model('Initiative')
export const Notes = mongoose.model('Notes')
export const Line = mongoose.model('Line')

export default {
  Logs,
  Initiative,
  Notes,
  Line,
}
