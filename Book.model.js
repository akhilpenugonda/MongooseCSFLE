var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BookSchema = new mongoose.Schema({
    title: String,
    author: String,
    category: String,
    name: String
});
module.exports = mongoose.model('Book', BookSchema);
