const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const connectionString = process.env.MONGODB_URI;

const client = new MongoClient(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let dbConnection = null;

module.exports = {
  connectToServer: async function (callback) {
    var clientConnection = await client.connect();
    dbConnection = clientConnection.db('ALPDB');
  },
  getDb: async function () {
    if(dbConnection)
    {
      return dbConnection;
    }
    else
    {
      await this.connectToServer();
      return dbConnection;
    }
  },
};