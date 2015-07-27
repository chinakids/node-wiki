# Node Wiki - 一个 nodejs 的 markdown 在线管理和编辑工具

<img src='https://github.com/chinakids/node-wiki/raw/master/logo.png' height='150' align='left'/>
:green_book:一个基于nodejs 的 wiki 知识管理系统，文档保存使用 markdown，数据库使用 mongodb，采用多线程技术，jade 模板技术(经过了预编译)，
markdown 扩展流程图、函数、甘特图、顺序图等工具图语法；还扩展了 emoji、Art-reactor、font-awesome、ionicons等图标，极大的增强了可用性。
文档库支持关键字检索（目前只支持文件检索,后期将支持全文检索）


[![npm version](https://badge.fury.io/js/npm.svg)](http://badge.fury.io/js/npm)
[![Build Status](https://travis-ci.org/chinakids/node-wiki.svg?branch=master)](https://travis-ci.org/chinakids/node-wiki)

### 预览

![screenshot](https://github.com/chinakids/node-wiki/raw/master/screenshot.png)
![screenshot](https://github.com/chinakids/node-wiki/raw/master/screenshot2.png)


###1.安装

#####1.1 环境配置（mac为例）

-  *、基础环境：node、git、brew(其他平台请参照其他包管理工具)、ruby(brew依赖)

-  2、安装mongodb并启动服务:   `brew install mongodb`   &   `mongod --config /home/mongodb/conf/mongod.conf`(配置文件每个人路径可能不同)


#####1.2 加载启动

- 1、 `git clone https://github.com/chinakids/node-wiki.git`

- 2、 `npm install`

- 3、 `bower install`

- 4、  多线程启动 `supervisor start.coffee` or `pm2 start start.coffee --watch`  

       单线程启动 `coffee app.coffee`

       如使用 node启动，初次安装后需要手动重启服务器


###2.备注

-   1.可能需要修改PORT，请在app.coffee中修改，数据库连接相关参数可以在欢迎页面设置，或者在 config/config.coffee 中设置

-   2.数据库字段配置请参照schemas目录文件

-   3.markdown 支持使用 [marked](https://github.com/chjj/marked)在服务器解析，扩展支持流程图，函数，甘特图，顺序图等

-   4.在线编辑器采用基于 [ace](https://github.com/ajaxorg/ace) 开发的 [markdown-plus](https://github.com/tylingsoft/markdown-plus),扩展支持 [Art-Reactor](https://github.com/chinakids/Art-Reactor) 字体，保存功能

###3.涉及技能

- jade
- node
- express
- markdown
- mongodb

###4.缺陷

- 未知问题

###5.PR说明
- 欢迎各种PR
- 提交代码一定要说清楚修改哦~

###6.下阶段开发计划
- ~~(紧急)独立出配置，首次安装建立引导页面（解决首次部署出现的种种问题）~~
- ~~扩展多线程~~
- 扩展用户中心功能
- 增加图片上传
- ~~增加超级管理员权限（方便删除）~~
- 增加`文档贡献者`板块
- 增加`文档 TAG`
- 增加全文搜索功能

###7.更新说明
##### V1.1.2(2015-07-22)
- 增加初次部署流程,将 config/config.js中的 `isFirst` 改为 `false`,开启初次部署。

##### V1.0.2(2015-07-18)
- 第一版可用版本发布，支持:
  - 1.用户登录
  - 2.新建 markdown 文档
  - 3.支持在线编辑
