mongoose = require 'mongoose'
#
#   创建书籍的shcema
#   @type {mongoose}
#
BookSchema = new mongoose.Schema
  name       : String
  content    : String
  pr         : Object
  map        : Object
  path       : String
  url        : String
  meta       :
    createAt :
      type      : Date
      default   : Date.now()
    updateAt :
      type      : Date
      default   : Date.now()
#
#   给save方法添加预处理
#
BookSchema.pre 'save', (next) ->
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
BookSchema.statics =
  fetch : (cb) ->
    @.find {}
      .sort 'meta.updateAt'
      .exec(cb)
  findBy : (id,cb) ->
    @.find
        _id:id
      .sort 'meta.updateAt'
      .exec cb
  findByUrl : (path,cb) ->
    @.find
        path:path
      .sort 'meta.updateAt'
      .exec cb
  findByName : (name,cb) ->
    @.find
        name:
          $regex:name
          $options:'i'
      .sort 'meta.updateAt'
      .exec cb
  deleteByUrl : (path,cb) ->
    @.remove
        path:path
      .sort 'meta.updateAt'
      .exec cb


module.exports = BookSchema
