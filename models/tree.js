var mongoose = require('mongoose');
var TreeSchema = require('../schemas/tree');
var Tree = mongoose.model('Menu',TreeSchema);
module.exports = Tree;
