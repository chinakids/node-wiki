marked = require 'marked'
mermaid = require 'mermaid'
katex = require 'katex'
domino = require 'domino'
Zepto = require 'zepto-node'

window = domino.createWindow()

$ = Zepto window

#初始化 marked 参数
renderer = new marked.Renderer()
renderer.listitem = (text) ->
  unless /^\[[ x]\]\s/.test text
    return marked.Renderer::listitem text
  #任务列表
  checkbox = $ '<input type="checkbox" disabled/>'
  if /^\[x\]\s/.test text # 完成的任务列表
    checkbox.attr 'checked', true
  $ marked.Renderer::listitem text.substring 3
    .addClass 'task-list-item'
    .prepend(checkbox)[0]
    .outerHTML

renderer.codespan = (text) ->
  if /^\$.+\$$/.test text
    raw = /^\$(.+)\$$/.exec(text)[1]
    #console.log /^\$(.+)\$$/.exec(text)[1]
    line = raw
      .replace /&lt;/g, '<'
      .replace /&gt;/g, '>'
      .replace /&amp;/g, '&'
      .replace /&quot;/g, '"'
      .replace /&#39;/g, "'"
    try
      return katex.renderToString line,
        displayMode: false
    catch err
      return '<code>' + err + '</code>'
  marked.Renderer::codespan.apply this, arguments

renderer.code = (code, language, escaped, line_number) ->
  code = code.trim()
  console.log '////////////'+language+'///////'+escaped+'///////'+line_number
  firstLine = code
    .split(/\n/)[0]
    .trim()
  if language is 'math'
    tex = '';
    code
      .split(/\n\n/)
      .forEach (line) ->
        line = line.trim()
        if line.length > 0
          try
            tex += katex.renderToString line,
              displayMode: true
            return
          catch err
            tex += '<pre>'+err+'</pre>'
            return
        return
    return '<div data-line="'+line_number+'">'+tex+'</div>'
  else if firstLine is 'gantt' or firstLine is 'sequenceDiagram' or firstLine.match /^graph (?:TB|BT|RL|LR|TD);?$/
    if firstLine is 'sequenceDiagram'
      code += '\n'; # 如果末尾没有空行，则语法错误
    if mermaid.mermaidAPI.parse code
      return '<div class="mermaid" data-line="'+line_number+'">'+code+'</div>'
    else
      return '<pre data-line="'+line_number+'">'+mermaidError+'</pre>'
  else
    return marked.Renderer::code.apply(this, arguments);

renderer.html = (html) ->
  result = marked.Renderer::html.apply this, arguments
  h = $ result.bold()
  h.html()

renderer.paragraph = (text) ->
  result = marked.Renderer::paragraph.apply this, arguments
  h = $ result.bold()
  h.html();

marked.setOptions
  renderer: renderer
  gfm: true
  tables: true
  breaks: false
  pedantic: false
  sanitize: false
  smartLists: true
  smartypants: true



markdown =
  #
  #   获取目录
  #   @param  {[str]} buffStr [读取的文件字符串]
  #   @param  {[function]} callback  [回调函数]
  #   @return {[obj]}         [目录对象]
  #
  getMenu: (buffStr, callback) ->
    #分行存入数组
    html = buffStr
    regex = /(<h[1-6])[^>]*?>/ig
    html = html.replace regex, "$1>"
    arr = html.split('\n')

    #before用来储存原始数组，创建空数组,用来储存目录对象,index 为目录层级
    before = []
    menu = []
    index = 1
    for key of arr
      title = arr[key].match(/^(\<h[1-6]\>[\s\S][^<\/]*\<\/h[1-6]\>)/g)
      if title isnt null
        before.push title[0]

    for key of before
      if before[key].indexOf 'h1' isnt -1
        reId = before[key].replace 'h1', 'h1 id="menu-' + key + '"'
        html = html.replace before[key], reId
        menu.push before[key].match(/^\<h[1-6]\>([\s\S][^<\/]*)\<\/h[1-6]\>/)[1]
      else if before[key].indexOf 'h2' isnt -1
        reId = before[key].replace 'h2', 'h2 id="menu-' + key + '"'
        html = html.replace before[key], reId
        menu.push before[key].match(/^\<h[1-6]\>([\s\S][^<\/]*)\<\/h[1-6]\>/)[1]
      else if before[key].indexOf 'h3' isnt -1
        reId = before[key].replace 'h3', 'h3 id="menu-' + key + '"'
        html = html.replace before[key], reId
        menu.push before[key].match(/^\<h[1-6]\>([\s\S][^<\/]*)\<\/h[1-6]\>/)[1]
      else if before[key].indexOf 'h4' isnt -1
        reId = before[key].replace 'h4', 'h4 id="menu-' + key + '"'
        html = html.replace before[key], reId
        menu.push before[key].match(/^\<h[1-6]\>([\s\S][^<\/]*)\<\/h[1-6]\>/)[1]
      else if before[key].indexOf 'h5' isnt -1
        reId = before[key].replace 'h5', 'h5 id="menu-' + key + '"'
        html = html.replace before[key], reId
        menu.push before[key].match(/^\<h[1-6]\>([\s\S][^<\/]*)\<\/h[1-6]\>/)[1]
      else if before[key].indexOf 'h6' isnt -1
        reId = before[key].replace 'h6', 'h6 id="menu-' + key + '"'
        html = html.replace before[key], reId
        menu.push before[key].match(/^\<h[1-6]\>([\s\S][^<\/]*)\<\/h[1-6]\>/)[1]
    callback html, menu

  #
  #   marked 转 html
  #   @param  {[type]}   buffStr  [传入的 marked 文档]
  #   @param  {Function} callback [description]
  #
  toHtml: (buffStr, callback) ->
    html = marked buffStr
    this.getMenu html, callback

module.exports = markdown
