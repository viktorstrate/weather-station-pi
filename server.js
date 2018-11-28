const fs = require('fs')
const express = require('express')
const app = express()
const http = require("http").Server(app)
const io = require('socket.io')(http)
const mongo = require('./database')

const port = 3000

app.use(express.static('client'))

io.on('connection', (socket) => {
  console.log("user connected")
  socket.on('disconnect', () => console.log("user disconnected"))
})

require('./database')((db) => {
  http.listen(3000, () => {
    console.log('Web server started')

    if (process.env.DISABLE_I2C != 1) {
      require('./i2c')(db)
    } else {
      console.log('Disabled i2c')
    }
  })
})