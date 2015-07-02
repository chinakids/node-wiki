var mongoose = require('mongoose');
/**
 * 创建产品的shcema
 * @type {mongoose}
 */
var WikiSchema = new mongoose.Schema({
  name       : String,
  author     : String,
  md5        : String,
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
WikiSchema.pre('save',function(next){
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
WikiSchema.statics = {
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
  findByAuthor : function(id,cb){
    return this
      .find({author:id})
      .sort('meta.updateAt')
      .exec(cb);
  }
}

module.exports = WikiSchema;
