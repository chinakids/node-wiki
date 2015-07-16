var mongoose = require('mongoose');
/**
 * 创建目录的shcema
 * @type {mongoose}
 */
var TreeSchema = new mongoose.Schema({
  tree       : Object,
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
TreeSchema.pre('save',function(next){
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
TreeSchema.statics = {
  fetch : function(cb){
    return this
      .find({})
      .sort('meta.updateAt')
      .exec(cb);
  }
}

module.exports = TreeSchema;
