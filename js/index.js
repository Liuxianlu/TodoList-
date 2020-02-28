;(function (node) {

  var TodoList = function () {

    var _self = this;
    this.node = node;
    this.inputShow = false;
    this.isEdit = false;
    this.curIdx = null;
    this.config = this.getConfig();
    this.itemClass = this.config.itemClass;
    this.setConfig();
    this.dConfig = {
      "plusBtn": "",
      "inputArea": "",
      "addBtn": "",
      "list": "",
      "itemClass": ""
    }

    // 如果有一项不存在就抛出错误提示
    for (var key in this.dConfig) {
      if (!this.config.hasOwnProperty(key)) {
        console.log(errotInfo(key));
        return;
      }
    }
    
    // 点击加号-两种状态
    addEvent(this.plusBtn, 'click', function () {
      _self.showInput.call(_self);
    });

    // 点击项目-两种状态
    addEvent(this.addBtn, 'click', function () {
      _self.addBtnClick.call(_self);
    });
    
    // 点击列表-事件代理-两种状态
    addEvent(this.oList, 'click', function (e) {
      var e = e || window.event,
          tar = e.target || e.srcElement;

      _self.listClick.call(_self, tar);
    });

  }

  // 多人协作改成TodoList.prototype.xxx = function () {}
  TodoList.prototype = {

    // JSON字符串转成对象
    getConfig: function () {
      return JSON.parse(this.node.getAttribute('data-config'));
    },
    
    // 获取元素
    setConfig: function () {
      var config = this.config,
          node = this.node;
      
      this.inputArea = node.getElementsByClassName(config.inputArea)[0];
      this.addBtn = this.inputArea.getElementsByClassName(config.addBtn)[0];
      this.plusBtn = node.getElementsByClassName(config.plusBtn)[0];
      this.oList = node.getElementsByClassName(config.list)[0];
      this.oItems = this.oList.getElementsByClassName('item');
      this.content = this.inputArea.getElementsByClassName('content')[0];
    },
    
    // 点击加号-两种状态-打开-关闭
    showInput: function () {
      var _self = this;
      if (this.inputShow) {
        setInputShow.call(_self, 'close');
      } else {
        setInputShow.call(_self, 'open');
      }
    },
    
    // 点击项目-两种状态-编辑-增加
    addBtnClick: function () {
      var _self = this,
          content = this.content.value,
          contentLen = content.length,
          oItems = this.oList.getElementsByClassName('item'),
          itemLen = oItems.length,
          itemText;

      if (contentLen <= 0) {
        alert('请输入项目');
        return;
      } else if (itemLen > 0) {
        for (var i = 0; i < itemLen; i++) {

          itemText = oItems[i].daughterElementNode(0).innerText;
          if (itemText === content) {
            alert('已存在该项目');
            this.content.value = '';
            return;
          }
        }
      }

      if (this.isEdit) {
        var alter = oItems[this.curIdx].daughterElementNode(0);
 
        alter.innerText = content;
        setInputStatus.apply(_self, [oItems, null, 'add']);

      } else {
        var oLi = document.createElement('li');
        oLi.className = this.itemClass;
        oLi.innerHTML = itemTpl(content);
        this.oList.appendChild(oLi);
      }

      setInputShow.call(_self, 'close');
    },

    
    // 点击列表-事件代理-两种状态-编辑-删除
    listClick: function (tar) {
      var _self = this,
          className = tar.className,
          oParent = tar.customParentElement(2);

      if (className === 'edit-btn fa fa-edit') {
        restoreItems(this.oItems);
        setInputShow.call(_self, 'open');
        setInputStatus.apply(_self, [this.oItems, oParent, 'edit']);
        
      } else if (className === 'remove-btn fa fa-times') {
        setInputShow.call(_self, 'close');
        setInputStatus.apply(_self, [this.oItems, oParent, 'add']);
        oParent.remove(tar);
      }
    }
  }


  //  加号状态-打开-关闭
  function setInputShow(action) {
    var oItems = this.oList.getElementsByClassName('item');
    if (action === 'open') {
      this.inputArea.style.display = 'block';
      this.inputShow = true;

    } else if (action === 'close') {
      this.inputArea.style.display = 'none';
      this.inputShow = false;
      this.content.value = '';
      setInputStatus.apply(this, [oItems, null, 'add']);
    }
  }

  // 项目按钮状态-编辑-增加
  function setInputStatus(oItems, tar, status) {
    if (status === 'edit') {
      var index = Array.prototype.indexOf.call(oItems, tar),
          text = tar.daughterElementNode(0).innerText;

      this.addBtn.innerText = '编辑第' + (index + 1) + '项';
      tar.className += ' active';
      this.isEdit = true;
      this.curIdx = index;
      this.content.value = text;

    } else if(status === 'add') {
      restoreItems(this.oItems);
      this.addBtn.innerText = '增加项目';
      this.isEdit = false;
      this.curIdx = null;
    }
  }

  // 全部列表项绿色清除
  function restoreItems(oItems) {
    var itemLen = oItems.length,
        item;
  
    for (var i = 0; i < itemLen; i++) {
      item = oItems[i];
      item.className = 'item';
    }
  }
  
  // 提示错误信息
  function errotInfo(key) {
    return new Error(
      '\n' + 
      '您没有配置参数' + key + '\n\n' + 
      '必须配置的参数列表如下：\n' + 
      '打开输入框按钮元素类名：plusBtn \n' + 
      '输入框区域元素类名：inputArea \n' +
      '增加项目按钮元素类名：addBtn \n' +
      '列表承载元素类名：list \n' +
      '列表项承载元素类名：itemClass'
    )
  }

  // 3个功能标签模版
  function itemTpl(text) {
    return (
      '<p class="item-content">' + text + '</p>' + 
      '<div class="btn-group">' + 
        '<a href="javascript:;" class="edit-btn fa fa-edit"></a>' + 
        '<a href="javascript:;" class="remove-btn fa fa-times"></a>' + 
      '</div>'
    );
  }

  new TodoList();

}(document.getElementsByClassName('wrap')[0]));