// 事件处理函数
function addEvent(elem, type, fn) {
  if (elem.addEventListener) {
    elem.addEventListener(type, fn, false);
  } else if (elem.attachEvent) {
    elem.attachEvent('on' + type, function () {
      fn.call(elem);
    });
  } else {
    elem['on' + type] = fn;
  }
}
// 示例代码：
// addEvent(div, 'click', function () {});
// -------------------------------------------------------------------------------------------------------------------------------------------

// 寻找子元素节点 传参数就返回对应下标 不传就返回子元素集合
Element.prototype.daughterElementNode = function (index) {
  var childNodes = this.childNodes,
      len = childNodes.length,
      type = typeof(index),
      temp = [],
      item;
  for (var i = 0; i < len; i++) {
    item = childNodes[i];
    if (item.nodeType === 1) {
      temp.push(item);
    }
  }
  // 防止乱传参数的情况
  if (index !== undefined && type !== 'number') {
    return 'undefined';
  }
  // 传参数和不传参数
  if (index === undefined) {
    return temp;
  } else {
    return temp[index];
  }
}
// 示例代码：
// div.daughterElementNode(1);// 传数字几返回子元素中第几个子元素节点，不传参数返回整个子元素集合
// -------------------------------------------------------------------------------------------------------------------------------------------

// 寻找元素的第N层父级元素 
Element.prototype.customParentElement = function (n) { 
  var elem = this;
  for (var i = 0; elem && i < n; i++) {
    elem = elem.parentNode;
  }
  if (n >= 0) {
    return elem;
  }
  return null;
}
// 示例代码：
// div.customParentElement(1);// 这里填数字几就返回第几个父级元素，不填参数或者填负数返回null
// -------------------------------------------------------------------------------------------------------------------------------------------
