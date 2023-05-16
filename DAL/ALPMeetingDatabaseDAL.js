const BookSchema = require("../Book.model");
const MongoDBDAL = require("./MongoDAL");
let collectionName = "ALP_Meeting_Database";
class ALPMeetingDatabaseDAL extends MongoDBDAL {
  
  constructor() {
    super(collectionName);
  }
}
module.exports = ALPMeetingDatabaseDAL;
