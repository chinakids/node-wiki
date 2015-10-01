crypto = require 'crypto'

rule =
  md5 : (str) ->
    md5 = crypto.createHash 'md5'
    d2 = md5
      .update str
      .digest 'hex'
    d2
    
  pw : (name,sid,singeStr) ->
    @.md5(name+'this_is_mixin_string'+sid) is singeStr ? true : false

  hash : () ->
module.exports = rule
