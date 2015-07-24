mongoose = require 'mongoose'

BookSchema = require '../schemas/book'

Book = mongoose.model 'Book',BookSchema

module.exports = Book
