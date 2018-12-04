const sqlite = require('sqlite')
const fs = require('fs')

const db_path = './database.sqlite'

function setup_db(db) {

  console.log('will load queries')
  const queryLight = fs.readFileSync('./setup-light.sql', 'utf8')
  const queryTemp = fs.readFileSync('./setup-temp.sql', 'utf8')

  console.log('loaded queries')

  return db.run(queryLight)
    .then(() => db.run(queryTemp))
    .then(() => {
      console.log('Made tables')
    })
    .catch(err => console.log('Could not make tables', err))
}

module.exports = new Promise((resolve, reject) => {
  const dbPromise = sqlite.open(db_path)

  dbPromise.then(db => {

    console.log('Loaded db')

    if (fs.statSync(db_path).size == 0) {
      console.log('db not initialized, making tables')

      setup_db(db)
        .then(() => {
          resolve(db)
        })
    } else {
      resolve(db)
    }
  }).catch(reject)
})