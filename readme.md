# hallo server

Simple webrtc signalling server for express.

## usage

```javascript
const halloServer = require('hallo-server')

// Start hallo-server and return io connection (socket.io)
const io = halloServer.use(server)
```