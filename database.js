const sqlite = require('sqlite')

module.exports = new Promise((resolve, reject) => {
  const dbPromise = sqlite.open('./database.sqlite')

  dbPromise.then(db => {



    resolve(db)
  }).catch(reject)
})
