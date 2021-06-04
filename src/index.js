const { httpServer, app } = require('./config/app')
const logger = require('./utils/logger')

try {
  httpServer.listen(8010)
} catch (error) {
  logger.error(error)
}

module.exports = app;