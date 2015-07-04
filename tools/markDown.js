/**
 * 目录节点
 */
function node(menu){
  this.menu = menu;
  this.next = null;
}
/**
 * 目录（链表）
 */
function llist(){
  this.head = new Node('head');
  this.find = find;
  this.insert = insert;
  this.remove = remove;
}
/**
 * 链表查找方法
 */
function find(){
  var currNode = this.head;
  while (currNode.menu != item){
    currNode = currNode.next;
  }
  return currNode;
}
/**
 * 链表插入方法
 */
function insert(newMenu,item){
  var newNode = new Node(newMenu);
  var current = this.find(item);
  newNode.next = current.next;
  current.next = newNode;
}
/**
 * 查找指定节点前节点
 */
function findPrevious(item){
  var currNode = this.head;
  while(!(currNode.next == null) && (currNode.next.menu != item)){
    currNode = currNode.next;
  }
  return currNode;
}
/**
 * 删除节点
 */
function remove(item){
  var prevNode = this.findPrevious(item);
  if (!(prevNode.next == null)){
    prevNode.next = prevNode.next.next
  }
}

var markDown = {
  /**
   * 获取目录
   * @param  {[str]} buffStr [读取的文件字符串]
   * @param  {[number]} deepin  [取出目录深度]
   * @return {[obj]}         [目录对象]
   */
  getMenu : function(buffStr,deepin){
    //分行存入数组
    var arr = buffStr.split('\r');
    //创建空数组,用来储存目录对象,index 为目录层级
    var menu = [],index = 0;
    for(var key in arr){
       arr[key].match(/^(#{1,6})[\s]?([^#\s]+)/)
    }
    //console.log(d2);
    return menu;
  }
}
module.exports = markDown;
