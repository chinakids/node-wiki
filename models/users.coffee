mongoose = require 'mongoose'

UserSchema = require '../schemas/users'

User = mongoose.model 'User',UserSchema

module.exports = User
