express = require('express')
fs = require('fs')
path = require('path')
render = require('../tools/render')
mdtools = require('../tools/markDown')
router = express.Router()

# GET home page.
router.get '/', (req, res, next) ->
  buffStr = fs.readFileSync path.join(__dirname, '../doc/readme.md'),'utf8'
  mdtools.toHtml buffStr, (html, menu) ->
    render.index res,
      title: 'Wiki 文档中心'
      html: html
      menu: menu
      tree: req.tree
      map: []
      loginInfo:req.loginInfo
    return
    #  res.render('index', {
    #    title: 'Wiki 文档中心',
    #    html: html,
    #    menu: menu,
    #    tree: req.tree,
    #    map: [],
    #    loginInfo:req.loginInfo
    #  });
  return

# GET home page.
router.get '/book', (req, res, next) ->
  md = req.query.md
  buffStr = fs.readFileSync path.join(__dirname, '../doc/' + md + '.md'),'utf8'
  mdtools.toHtml buffStr, (html, menu) ->
    render.index res,
      title: md.split('/')[md.split('/').length - 1]
      html: html
      menu: menu
      tree: req.tree
      map: md.split('/')
      loginInfo:req.loginInfo
      download:req.query.md
    return
  return

# 下载
router.get '/download', (req, res, next) ->
  md = req.query.md
  res.download path.join(__dirname, '../doc/' + md + '.md'),md.split('/')[md.split('/').length -1]+'.md'
  return

module.exports = router
