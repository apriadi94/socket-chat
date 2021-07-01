const express = require('express')
const app = require('express')()
const bodyParser = require('body-parser')
const cors = require('cors')
const httpServer = require("http").createServer(app)
const dotenv = require('dotenv')
const fileUpload = require('express-fileupload');


app.use(cors({ credentials: true }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true}))
app.use(express.static('upload'));
app.use(fileUpload());


const authMiddleware = require('./src/middlewares/authMiddleware')
const listener = require('./src/socket')
const router = require('./src/routes')

dotenv.config()

const io = require("socket.io")(httpServer, {
    cors: {
      origin: process.env.APP_CORS,
    },
});

app.use('/api', router)

authMiddleware(io)
listener(io)
  
httpServer.listen(8010)
