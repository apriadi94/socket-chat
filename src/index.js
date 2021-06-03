const { httpServer, app } = require('./config/app')
const logger = require('./utils/logger')

try {
  httpServer.listen(process.env.APP_PORT)
} catch (error) {
  logger.error(error)
}

module.exports = app;