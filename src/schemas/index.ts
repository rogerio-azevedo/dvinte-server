// Import schemas with TypeScript interfaces
import LogsModel, { ILogs } from './Logs.js'
import InitiativeModel, { IInitiative } from './Initiative.js'
import NotesModel, { INotes } from './Notes.js'
import LineModel, { ILine } from './Line.js'

// Export models with proper typing
export const Logs = LogsModel
export const Initiative = InitiativeModel
export const Notes = NotesModel
export const Line = LineModel

// Export types
export type { ILogs, IInitiative, INotes, ILine }

export default {
  Logs,
  Initiative,
  Notes,
  Line,
}
