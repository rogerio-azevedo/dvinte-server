import Note from '../schemas/Notes'

import { saveNote } from '../../websocket'

class NotesController {
  async index(req, res) {
    const note = await Note.find({
      user_id: req.query.user_id,
    })

    const notes = note.map(c => ({
      user: c.user,
      date: c.createdAt,
      note: c.note,
    }))

    return res.json(notes)
  }

  async store(req, res) {
    const created = await Note.create(req.body)

    const message = {
      user: created.user,
      date: created.createdAt,
      note: created.note,
    }
    saveNote(message)

    return res.json(created)
  }
}

export default new NotesController()
