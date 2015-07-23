var fs = require("fs");
var path = require("path");
var jade = require("jade");

// viewPathSet =
//   helper: path.resolve(config.viewPath, "helper")
//   viewer: path.resolve(config.viewPath)
//   error: path.resolve(config.viewPath, "error")
//   partial: path.resolve(config.viewPath, "partial")

var pages ={
  index: "index.jade",
  first: "first.jade",
  list: "list.jade",
  login: "login.jade",
  register: "register.jade",
  error: "error.jade"
}
console.log('///////'+path.join(__dirname,'./../views/'))
var compiledJade = {};
var compileOption = {
  filename: path.join(__dirname,'./../views/layout')
};
var render = {};
var done = 0;
var all = undefined;

// res发送html字符串
var sendPage = function(res, html){
  res.end(html);
}


// 通过map实现每个页面渲染func的生成
var compileRenderService = function(){
  done = 0
  all = 0

  for(var name in pages){
    preCompile(path.join(__dirname,'./../views/'+pages[name]), name)
    all++
  }
}
var preCompile = function(filePath, pageName){
  console.log(filePath);
  // fs.readFile( path.join( viewPathSet.viewer, p+'.jade' ), function( err, jadeStr ){
  fs.readFile(filePath, function(err, jadeStr){
    if(err){
      console.log("read jade file err: " + filePath + ".jade");
    }else{
      console.log(compileOption);
      compiledJade[pageName] = jade.compile(jadeStr, compileOption)
      render[pageName] = function(res, data){
        var html = compiledJade[pageName](data)
        sendPage(res, html);
      }
      done++
      if(done >= all){
        console.log("\tre compile jade views"  );
      }
    }
  })
}

console.log("\tre compile jade views");
compileRenderService()

// //判断环境
// envStr = fs.readFileSync(path.join(__dirname, "../../public/dist/version.js"), "utf-8")
// if envStr.indexOf("env: 'dev'") >= 0
//   logger.info "developing..."
//   for key of viewPathSet
//     fs.watch viewPathSet[key], ->
//       console.time "\tre compile jade views"
//       compileRenderService()


//   logger.info( 'production...' );
module.exports = render