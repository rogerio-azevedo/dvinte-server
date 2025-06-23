// Utility functions for emitting Socket.IO events from controllers
// These functions can be imported and used in any controller

let fastifyInstance: any = null

// Initialize the fastify instance reference
export function initWebsocketUtils(fastify: any) {
  fastifyInstance = fastify
}

// Utility functions based on the old websocket.js
export function saveMessage(message: any) {
  if (fastifyInstance?.io) {
    fastifyInstance.io.emit('chat.message', message)
  }
}

export function saveNote(message: any) {
  if (fastifyInstance?.io) {
    fastifyInstance.io.emit('note.message', message)
  }
}

export function addInitiative(message: any) {
  if (fastifyInstance?.io) {
    fastifyInstance.io.emit('init.message', message)
  }
}

export function updateToken(message: any) {
  if (fastifyInstance?.io) {
    fastifyInstance.io.emit('token.message', message)
  }
}

export function changeMap(message: any) {
  if (fastifyInstance?.io) {
    fastifyInstance.io.emit('map.message', message)
  }
}

export function addLine(message: any) {
  if (fastifyInstance?.io) {
    fastifyInstance.io.emit('line.message', message)
  }
}

// Generic emit function
export function emitEvent(event: string, data: any) {
  if (fastifyInstance?.io) {
    fastifyInstance.io.emit(event, data)
  }
}
