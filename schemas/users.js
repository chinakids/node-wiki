var mongoose = require('mongoose');
/**
 * 创建用户的shcema
 * @type {mongoose}
 */
var UserSchema = new mongoose.Schema({
  userName   : String,
  passWord   : String,
  email      : String,
  role       : String,
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
UserSchema.pre('save',function(next){
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
UserSchema.statics = {
  fetch : function(cb){
    return this
      .find({})
      .sort('meta.updateAt')
      .exec(cb);
  },
  findBy : function(id,cb){
    //console.log(id);
    return this
      .find({_id:id})
      .sort('meta.updateAt')
      .exec(cb);
  },
  findByEmail : function(id,cb){
    //console.log(id);
    return this
      .find({email:id})
      .sort('meta.updateAt')
      .exec(cb);
  }
}

module.exports = UserSchema;
