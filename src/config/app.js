const app = require('express')()
const httpServer = require("http").createServer(app)
const dotenv = require('dotenv')

const authMiddleware = require('../middlewares/authMiddleware')
const listener = require('../socket')
const router = require('../routes')

dotenv.config()

const io = require("socket.io")(httpServer, {
    cors: {
      origin: process.env.APP_CORS,
    },
});

app.use('/', router)

authMiddleware(io)
listener(io)
  
module.exports = { httpServer, app }
