const fs = require('fs')
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  const html = fs.readFileSync('./client/index.html', { encoding: 'utf8' })
  res.send(html)
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))