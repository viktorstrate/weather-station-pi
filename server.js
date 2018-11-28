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

mongo.connect((err, client) => {
  if(err != null){
    console.log("db connection faild:", err)
    return
  }

  console.log("db connected")
  const db = client.db("weather-station")

  http.listen(3000, () => {
    console.log('Web server started')

    require('./i2c')(db)
  })

})