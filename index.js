const socket = require('socket.io')

function generateSocket(server) {
  const io = socket(server)

  io.on('connection', (socket) => {
    socket.on('hallo_join', (roomId) => {
      const roomClients = io.sockets.adapter.rooms.get(roomId) || { size: 0 }

      if (roomClients.size == 0) {
        socket.join(roomId)
        socket.emit('hallo_created', roomId)
      } else {
        socket.join(roomId)
        socket.emit('hallo_joined', roomId)
      }
    })

    socket.on('hallo_new_peer', (roomId) => socket.broadcast.to(roomId).emit('hallo_new_peer', socket.id))
    socket.on('hallo_left', (roomId) => socket.broadcast.to(roomId).emit('hallo_left', socket.id))
    socket.on('hallo_offer', (event) => socket.to(event.peerId).emit('hallo_offer', socket.id, event.sdp))
    socket.on('hallo_answer', (event) => socket.to(event.peerId).emit('hallo_answer', socket.id, event.sdp))
    socket.on('hallo_candidate', (event) => socket.to(event.peerId).emit('hallo_candidate', socket.id, event))
  })
}

exports.use = (server) => generateSocket(server)