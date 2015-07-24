mongoose = require 'mongoose'

TreeSchema = require '../schemas/tree'

Tree = mongoose.model 'Menu',TreeSchema

module.exports = Tree
