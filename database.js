const Mongoclient = require('mongodb').MongoClient
const url = "mongodb://localhost:27017"
const client = new Mongoclient(url)

module.exports = client