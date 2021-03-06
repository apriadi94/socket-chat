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


const authMiddleware = require('../middlewares/authMiddleware')
const listener = require('../socket')
const router = require('../routes')

dotenv.config()

const io = require("socket.io")(httpServer, {
    cors: {
      origin: process.env.APP_CORS,
    },
});

app.use('/api', router)

authMiddleware(io)
listener(io)
  
module.exports = { httpServer, app }
