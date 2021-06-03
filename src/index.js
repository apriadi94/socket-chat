const app = require('express')()
const httpServer = require("http").createServer(app)
const listener = require('./socket')
const router = require('./routes')

const io = require("socket.io")(httpServer, {
  cors: {
    origin: "*",
  },
});

app.use('/', router)
listener(io)

httpServer.listen(8010)

module.exports = app;