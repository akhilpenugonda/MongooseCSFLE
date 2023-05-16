const ALPDBSchema = require("../ALPDatabase.model");
const MongoDBDAL = require("./MongoDAL");
let collectionName = "ALP_Database";
class ALPDatabaseDAL extends MongoDBDAL {
  
  constructor() {
    super(collectionName);
  }
}
module.exports = ALPDatabaseDAL;
