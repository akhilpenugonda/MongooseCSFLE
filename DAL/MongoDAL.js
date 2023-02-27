const connection = require("../conn");
const MongoClient = require('mongodb').MongoClient;

class DataAccessLayer {
  constructor(collection) {
    this.collection = collection;
  }

  async connect() {
    await connection.connectToServer();
  }

  async find(queryDocument, optionsDocument) {
    let dbContext = await connection.getDb();
    let collectionContext = dbContext.collection(this.collection);
    var resp = await collectionContext.find(queryDocument).toArray();
    return resp;
  }

  async findOne(queryDocument, optionsDocument) {
    let dbContext  = await connection.getDb();
    let collectionContext = dbContext.collection(this.collection);
    var resp = await collectionContext.findOne(queryDocument);
    return resp;
  }

  async insertOne(queryDocument, optionsDocument) {
    let dbContext  = await connection.getDb();
    let collectionContext = dbContext.collection(this.collection);
    var resp = await collectionContext.insertOne(queryDocument);
    return resp;
  }

  async findOneAndDelete(queryDocument, optionsDocument) {
    let dbContext  = await connection.getDb();
    let collectionContext = dbContext.collection(this.collection);
    var resp = await collectionContext.findOneAndDelete(queryDocument);
    return resp.value;
  }

  async findOneAndUpdate(queryDocument, update, optionsDocument) {
    let dbContext  = await connection.getDb();
    let collectionContext = dbContext.collection(this.collection);
    var resp = await collectionContext.findOneAndUpdate(queryDocument, update);
    return resp.value;
  }
}

module.exports = DataAccessLayer;
