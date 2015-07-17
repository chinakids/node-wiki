var mongoose = require('mongoose');
var BookSchema = require('../schemas/book');
var Book = mongoose.model('Book',BookSchema);
module.exports = Book;
