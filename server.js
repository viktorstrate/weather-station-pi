const PORT = 3000

const fs = require('fs')
const express = require('express')
const app = express()
const http = require("http").Server(app)
const io = require('socket.io')(http)
const mongo = require('./database')

app.use(express.static('client'))

require('./database').then(db => {

  io.on('connection', (socket) => {
    console.log("user connected")

    db.all('SELECT * FROM light_sensor').then(rows => {
      const data = rows.map(x => [new Date(x.timestamp).getTime(), x.value])

      socket.emit('light_sensor_start_values', data)
    })

    db.all('SELECT * FROM temperature_sensor').then(rows => {
      const data = rows.map(x => [new Date(x.timestamp).getTime(), x.value])

      socket.emit('temp_sensor_start_values', data)
    })

    socket.on('disconnect', () => console.log("user disconnected"))
  })

  http.listen(PORT, () => {
    console.log('Web server started on http://localhost:' + PORT)

    if (process.env.DISABLE_I2C != 1) {
      require('./i2c')(db, io)
    } else {
      console.log('Disabled i2c')
    }
  })
})

