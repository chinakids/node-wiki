treeModel = require '../models/tree'
bookModel = require '../models/book'
fs = require 'fs'
_ = require 'underscore'
path = require 'path'

updata =
  menu : (port) ->
    #console.log(port);
    saveBook = (name,path) ->
      bookModel.findByUrl path, (err,book) ->
        if err
          console.log err
        if book.length <= 0
          # 新建储存
          newBook = new bookModel
            name    : name
            path    : path
            map     : path.split('doc/')[1].split('/')
            url     : '/book?md='+path.split('doc/')[1].split('.')[0]
          newBook.save (err,book) ->
            if err
              console.log err
            return
        else
          #更新储存（一个 URL 只会有一条）
          #do more 还要存入内容
          bookInfo =
            name    : name,
            path    : path,
            map     : path.split('doc/')[1].split('/'),
            url     : '/book?md='+path.split('doc/')[1].split('.')[0]
          newBook = _.extend book[0],bookInfo
          newBook.save (err,book) ->
            if err
              console.log err
            return
        return
      return
    treeNode = {}
    # 目录遍历
    walk = (path, treeNode, callback) ->
      callback = callback or ()->
      treeNode.path = path
      treeNode.subNodes = []
      treeNode.files = []
      treeNode.pathName = path.split('/')[path.split('/').length - 1]

      dirList = fs.readdirSync path
      dirList.forEach (item) ->
        if fs.statSync(path + '/' + item).isDirectory()
          subNode = {}
          treeNode.subNodes.push(subNode)
          walk(path + '/' + item, subNode)
        else
          if item isnt '.DS_Store' and item isnt 'readme.md' and item.indexOf('.md') isnt -1
            saveBook item.split('.')[0],path + '/'+item
            treeNode.files.push item.split('.')[0]
        return
      callback treeNode
      return
    walk path.join(__dirname, '../doc'), treeNode, (treeNode) ->
      #存入数据库
      treeModel.fetch (err,tree) ->
        if err
          console.log err
        if tree.length<=0
          _tree = new treeModel
            tree   :  treeNode
          _tree.save (err, tree) ->
            if err
              console.log err
            console.log '成功更新目录数据库'
            return
        else
          _tree = _.extend(tree[0],{tree:treeNode});
          _tree.save (err, tree) ->
            if err
              console.log err
            console.log '成功更新目录数据库'
            return
        return
      return
    return
module.exports = updata
