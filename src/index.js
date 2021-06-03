const app = require('express')()

app.use('/', (req, res) => {
    res.json({
        socket : 'this socket still in development'
    }).status(200)
})

app.listen(8010)

module.exports = app;