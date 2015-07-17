var mongoose = require('mongoose');
/**
 * 创建书籍的shcema
 * @type {mongoose}
 */
var BookSchema = new mongoose.Schema({
  name       : String,
  content    : String,
  pr         : Object,
  map        : Object,
  path       : String,
  url        : String,
  meta       : {
    createAt : {
      type      : Date,
      default   : Date.now()
    },
    updateAt : {
      type      : Date,
      default   : Date.now()
    }
  }
})
/**
 * 给save方法添加预处理
 */
BookSchema.pre('save',function(next){
  if(this.isNew){
    this.meta.createAt = this.meta.updateAt = Date.now();
  }else{
    this.meta.updateAt = Date.now();
  }
  next();
})
/**
 * 绑定静态方法
 * @type {Object}
 */
BookSchema.statics = {
  fetch : function(cb){
    return this
      .find({})
      .sort('meta.updateAt')
      .exec(cb);
  },
  findBy : function(id,cb){
    return this
      .find({_id:id})
      .sort('meta.updateAt')
      .exec(cb);
  },
  findByUrl : function(id,cb){
    return this
      .find({path:id})
      .sort('meta.updateAt')
      .exec(cb);
  },
  findByName : function(name,cb){
    return this
      .find({name:{$regex:name,$options:'i'}})
      .sort('meta.updateAt')
      .exec(cb);
  }
}

module.exports = BookSchema;
