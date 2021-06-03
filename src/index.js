const app = require('express')()
const httpServer = require("http").createServer(app)
const dotenv = require('dotenv')
dotenv.config()
const listener = require('./socket')
const router = require('./routes')

const io = require("socket.io")(httpServer, {
  cors: {
    origin: process.env.APP_CORS,
  },
});

app.use('/', router)
listener(io)

httpServer.listen(process.env.APP_PORT)

module.exports = app;