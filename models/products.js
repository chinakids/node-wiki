var mongoose = require('mongoose');
var ProductSchema = require('../schemas/products');
var Product = mongoose.model('Product',ProductSchema);
module.exports = Product;