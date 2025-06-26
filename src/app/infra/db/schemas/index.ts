// Import schemas with TypeScript interfaces
import LogsModel, { ILogs } from './Logs'
import InitiativeModel, { IInitiative } from './Initiative'
import NotesModel, { INotes } from './Notes'
import LineModel, { ILine } from './Line'

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
