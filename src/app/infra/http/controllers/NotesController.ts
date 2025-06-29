import { FastifyRequest, FastifyReply } from 'fastify'
import Notes from '../../../infra/db/schemas/Notes'
import { saveNote } from '../../../shared/utils/websocket'

interface NoteRequest {
  user_id: number
  user: string
  note: string
}

class NotesController {
  async index(
    request: FastifyRequest<{ Querystring: { user_id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const notes = await Notes.find({
        user_id: Number(request.query.user_id),
      })

      const formattedNotes = notes.map(note => ({
        user: note.user,
        date: note.createdAt,
        note: note.note,
      }))

      return reply.send(formattedNotes)
    } catch (error) {
      return reply.status(500).send({ error: 'Internal server error' })
    }
  }

  async store(
    request: FastifyRequest<{ Body: NoteRequest }>,
    reply: FastifyReply
  ) {
    try {
      const created = await Notes.create(request.body)

      const message = {
        user: created.user,
        date: created.createdAt,
        note: created.note,
      }

      saveNote(message)

      return reply.send(message)
    } catch (error) {
      return reply.status(500).send({ error: 'Internal server error' })
    }
  }
}

export default new NotesController()
