mongoose = require 'mongoose'
#
#   创建用户的shcema
#   @type {mongoose}
#
UserSchema = new mongoose.Schema
  userName   : String
  passWord   : String
  email      : String
  role       : String
  admin      : Boolean
  meta       :
    createAt :
      type      : Date
      default   : Date.now()
    updateAt :
      type      : Date,
      default   : Date.now()

#
#   给save方法添加预处理
#
UserSchema.pre 'save', (next) ->
  if this.isNew
    this.meta.createAt = this.meta.updateAt = Date.now()
  else
    this.meta.updateAt = Date.now()
  next()
  return

#
#   绑定静态方法
#   @type {Object}
#
UserSchema.statics =
  fetch : (cb) ->
    @.find {}
      .sort 'meta.updateAt'
      .exec cb
  findBy : (id,cb) ->
    #console.log(id);
    @.find
        _id:id
      .sort 'meta.updateAt'
      .exec cb
  findByEmail : (id,cb) ->
    #console.log(id);
    @.find
        email:id
      .sort 'meta.updateAt'
      .exec cb

module.exports = UserSchema
