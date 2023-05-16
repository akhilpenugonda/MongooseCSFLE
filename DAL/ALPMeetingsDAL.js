const BookSchema = require("../Book.model");
const MongoDBDAL = require("./MongoDAL");
let collectionName = "ALP_Meetings";
class ALPMeetingsDAL extends MongoDBDAL {
  
  constructor() {
    super(collectionName);
  }
}
module.exports = ALPMeetingsDAL;