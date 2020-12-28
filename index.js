const socket = require('socket.io')
const Rooms = require('./rooms')

function generateSocket(server) {
  const io = socket(server)
  const rooms = new Rooms()

  io.on('connection', (socket) => {
    socket.on('hallo_join', (userId, roomId) => {
      socket.username = userId || socket.id
      socket.room = roomId
      socket.describe = () => { return {id: socket.id, username: socket.username, room: socket.room} }
      socket.toRoom = (event, ...args) => socket.broadcast.to(roomId).emit(event, socket.describe(), ...args)
      socket.toPeer = (peerId, event, ...args) => socket.to(peerId).emit(event, socket.describe(), ...args)
      socket.toSelf = (event, ...args) => socket.emit(event, socket.describe(), ...args)

      rooms.join(socket.room, socket.username,
        () => {
          socket.join(roomId)
          socket.toSelf('hallo_created')
        },
        () => {
          socket.join(roomId)
          socket.toSelf('hallo_joined')
        },
        () => {
          socket.toSelf('hallo_already_joined')
          socket.disconnect()
        })
    })

    socket.on('hallo_new_peer', () => socket.toRoom('hallo_new_peer'))
    socket.on('hallo_left', () => rooms.leave(socket.room, socket.username, () => socket.toRoom('hallo_left')))
    socket.on('hallo_offer', (event) => socket.toPeer(event.peerId, 'hallo_offer', event))
    socket.on('hallo_answer', (event) => socket.toPeer(event.peerId, 'hallo_answer', event))
    socket.on('hallo_candidate', (event) => socket.toPeer(event.peerId, 'hallo_candidate', event))
    socket.on('disconnect', (reason) => {
      if(reason === 'server namespace disconnect') return
      rooms.leave(socket.room, socket.username, () => socket.toRoom('hallo_left'))
    })
  })

  return io
}

exports.use = (server) => generateSocket(server)