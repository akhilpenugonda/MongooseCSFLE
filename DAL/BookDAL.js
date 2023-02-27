const BookSchema = require("../Book.model");
const MongoDBDAL = require("./MongoDAL");
let collectionName = "books";
class BooksDAL extends MongoDBDAL {
  
  constructor() {
    super(collectionName);
  }
  
  async find(queryDocument, optionsDocument) {
    const books = await super.find(queryDocument, optionsDocument);
    return books.map(book => {
      const transformedBook = {};
      Object.keys(BookSchema).forEach(key => {
        transformedBook[key] = book[key];
      });
      return transformedBook;
    });
  }
}
module.exports = BooksDAL;
