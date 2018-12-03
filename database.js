const sqlite = require('sqlite')
const fs = require('fs')

const db_path = './database.sqlite'

function setup_db(db) {
  const query = fs.readFileSync('./setup.sql', 'utf8')
  db.run(query)
  console.log('database tables made successfully')
}

module.exports = new Promise((resolve, reject) => {
  const dbPromise = sqlite.open(db_path)

  dbPromise.then(db => {

    if (fs.statSync(db_path).size == 0) {
      console.log('db not initialized, making tables')
      setup_db(db)
    } else {
      resolve(db)
    }
  }).catch(reject)
})