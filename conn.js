const MongoClient = require('mongodb').MongoClient;
const BookModel = require('./Book.model');
require('dotenv').config();

const connectionString = process.env.MONGODB_URI;

const arr = [];
for (let i = 0; i < 96; ++i) {
  arr.push(i);
}
const key = Buffer.from(arr);
const keyVaultNamespace = 'client.encryption';
const kmsProviders = { local: { key } };

const client = new MongoClient(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // Configure auto encryption
  autoEncryption: {
    keyVaultNamespace, 
    kmsProviders
  }
});

let dbConnection;

module.exports = {
  connectToServer: async function (callback) {
    var clientConnection = await client.connect();
    dbConnection = clientConnection.db('test');
    dbConnection.command(
      {
        collMod: 'books', 
        validator: {
          $jsonSchema: BookModel.bookSchema,
        },
      }
    );
  },
 
  getDb: function () {
    return dbConnection;
  },
};
