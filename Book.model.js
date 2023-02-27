//var mongoose = require('mongoose');
//var Schema = mongoose.Schema;
const { Schema } = require('mongodb');

// var BookSchema = new Schema({
//     title: String,
//     author: String,
//     category: String,
//     name: String
// });
const bookSchema = {
  bsonType: 'object',
  properties: {
      title:{
          bsonType: 'string'
      },
      author: {
          bsonType: 'string'
      },
      category: {
          bsonType: 'string'
      },
      name: {
        bsonType: 'string'
      }
    }
  };
function createBook({ title, author, category, name }) {
    return {
      title,
      author,
      category,
      name,
    };
  }
module.exports = {bookSchema, createBook};
