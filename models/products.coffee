mongoose = require 'mongoose'

ProductSchema = require '../schemas/products'

Product = mongoose.model 'Product',ProductSchema

module.exports = Product
