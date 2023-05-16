const BookSchema = require("../Book.model");
const MongoDBDAL = require("./MongoDAL");
let collectionName = "ALP_Supervision_Client";
class ALPSupervisionDAL extends MongoDBDAL {
  
  constructor() {
    super(collectionName);
  }
}
module.exports = ALPSupervisionDAL;