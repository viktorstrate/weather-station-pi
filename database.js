const sqlite = require('sqlite')
const fs = require('fs')

const db_path = './database.sqlite'

function setup_db(db, resolve) {
  const query = fs.readFileSync('./setup.sql', 'utf8')
  db.run(query, () => resolve(db))
  console.log('database tables made successfully')
  resolve(db)
}

module.exports = new Promise((resolve, reject) => {
  const dbPromise = sqlite.open(db_path)

  dbPromise.then(db => {

    console.log('Loaded db')

    if (fs.statSync(db_path).size == 0) {
      console.log('db not initialized, making tables')
      setup_db(db, resolve)
    } else {
      resolve(db)
    }
  }).catch(reject)
})