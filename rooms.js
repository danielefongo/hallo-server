class Rooms {
  constructor() {
    this.rooms = {}
  }

  join(room, user, createdCallback, joinedCallback, alreadyJoinedCallback) {
    if (!this.exists(room)) {
      this.create(room)
      this.addUser(room, user)
      createdCallback()
    } else {
      if (this.userJoined(room, user)) alreadyJoinedCallback()
      else {
        this.addUser(room, user)
        joinedCallback()
      }
    }
  }

  leave(room, user, leavedCallback) {
    if(this.userJoined(room, user)) {
      this.removeUser(room, user)
      if(!this.hasUsers(room)) this.destroy(room)
      leavedCallback()
    }
  }

  create = (room) => this.rooms[room] = []
  destroy = (room) => delete this.rooms[room]
  exists = (room) => this.rooms[room] !== undefined
  hasUsers = (room) => this.rooms[room].length > 0

  addUser = (room, user) => this.rooms[room].push(user)
  removeUser = (room, user) => this.rooms[room].splice(this.rooms[room].indexOf(user), 1)
  userJoined = (room, user) => this.exists(room) && this.rooms[room].includes(user)
}

module.exports = Rooms