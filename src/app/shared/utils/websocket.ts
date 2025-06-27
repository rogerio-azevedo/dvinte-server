// Utility functions for emitting WebSocket events from controllers
// These functions can be imported and used in any controller

let fastifyInstance: any = null

// Initialize the fastify instance reference
export function initWebsocketUtils(fastify: any) {
  fastifyInstance = fastify
}

// Utility functions for broadcasting WebSocket events
export function saveMessage(message: any) {
  if (fastifyInstance?.broadcast) {
    fastifyInstance.broadcast(message.event, message.data)
  }
}

export function saveNote(message: any) {
  if (fastifyInstance?.broadcast) {
    fastifyInstance.broadcast('note.message', message)
  }
}

export function addInitiative(message: any) {
  if (fastifyInstance?.broadcast) {
    fastifyInstance.broadcast('init.message', message)
  }
}

export function updateToken(message: any) {
  if (fastifyInstance?.broadcast) {
    fastifyInstance.broadcast('token.message', message)
  }
}

export function changeMap(message: any) {
  if (fastifyInstance?.broadcast) {
    fastifyInstance.broadcast('map.message', message)
  }
}

export function addLine(message: any) {
  if (fastifyInstance?.broadcast) {
    fastifyInstance.broadcast('line.message', message)
  }
}

// Generic emit function
export function emitEvent(event: string, data: any) {
  if (fastifyInstance?.broadcast) {
    fastifyInstance.broadcast(event, data)
  }
}
