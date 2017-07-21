/**
 * Created by liulingli on 2017/7/14.
 * desc OAK电子病历编辑器，扩展百度Ueditor的控件
 */
/**
 * @method 判断该节点或者所有父节点中是否包含oakplugin属性,有则返回节点,没有返回fasle
 * 元素有oak-field属性才判断,为减少判断次数
 * @param target
 * @param parent
 * @return
 */
function isParentTarget(target,attr){
  var isOakField = (target.getAttribute("class")||"").indexOf("oak-field") > -1;
  var oakplugin = target.getAttribute(attr);
  if(isOakField){
    if(oakplugin){
      return target;
    }else{
     while(target.parentNode&&(target.getAttribute("class")||"").indexOf("oak-field") > -1){
        target = target.parentNode;
        if(target.getAttribute(attr)){
          return target;
          break;
        }
     }
    }
  }else{
    return false;
  }
}

/**
 * @method 获取target元素所在iframe下的body元素
 * @param target
 * @return
 */
function getBodyTarget(target){
  if(target.tagName == 'BODY'){
    return target;
  }
  while (target = target.parentNode){
    if(target.tagName == 'BODY'){
      return target;break;
    }
  }
}
/**
 * Created by liulingli on 2017/7/10.
 * desc OAK电子病历编辑器，根据百度Ueditor封装
 */
var utils = baidu.editor.utils;
var commands = [];
// 为工具栏添加按钮，以下都是统一的按钮触发命令，所以写在一起
var editCmds =  [
  'bold', 'italic', 'underline', 'fontborder','strikethrough', 'subscript', 'superscript','|',
  'paragraph','fontfamily','fontsize','|',
  'indent', 'outdent','|',
  'rowspacingtop','rowspacingbottom','lineheight','|',
  'forecolor','backcolor','insertorderedlist','insertunorderedlist','indent','|',
  'justifyleft','justifycenter','justifyright','justifyjustify'
];
var fixedCmds = [
  'undo', 'redo', 'formatmatch','removeformat','|','print','preview','searchreplace','|','allwidgets','allhtml'
]
var insertCmds = [
  'simpleupload','insertimage','scrawl','inserttable','|','pagebreak','spechars','|','kityformula','|','horizontal','snapscreen','|',
  'inserttable','deletetable','insertparagraphbeforetable','insertrow','deleterow','insertcol','deletecol','|',
  'mergecells','mergeright','mergedown','splittocells','splittorows','splittocols',
];
/*var insertCmds = [
 'kityformula'
 ]*/
var tableCmds = [
  'deletetable','insertparagraphbeforetable','insertrow','deleterow','insertcol','deletecol','|',
  'mergecells','mergeright','mergedown','splittocells','splittorows','splittocols',
];
var emreCmds = [
  'template','controllibrary','checkbox','radio','select','input','timeinput'
]

/**
 * 创建OAKEditor对象
 * @param {JSON} options
 */
var OAKEditor = function (options) {
  this.editor = options.editor; //百度编辑器实例，必须传入
  this.editorui = baidu.editor.ui;
  this.command = options.command || command;
};
/**
 * 添加原型方法
 */
OAKEditor.prototype = {
  /**
   * 扩展编辑器命令
   * @param name
   * @param obj
   */
  registerCommand: function (name, obj) {
    this.editor.command[name] = obj;
  },
  /**
   * 生成命令按钮html
   */
  renderCommand: function (command) {
    var html = "";
    command = command||this.command;
    for(var i=0;i<command.length;i++){
      var commondUI = this.editorui[command[i]];
      if(!commondUI){
        html += "<div class='edui-box edui-separator edui-default'></div>"
      }else{
        var ui = commondUI(this.editor);
        html += ui.renderHtml();
      }

      //ui.postRender();
    }
    return html;
  },
}

function command(editor){
  var editH = new OAKEditor({editor:editor,command:editCmds});
  var fixedH = new OAKEditor({editor:editor,command:fixedCmds});
  var insertH = new OAKEditor({editor:editor,command:insertCmds});
  let emreH = new OAKEditor({editor:editor,command:emreCmds});
  return {
    editHtml : editH.renderCommand(),
    fixedHtml : fixedH.renderCommand(),
    insertHtml : insertH.renderCommand(),
    emreHtml : emreH.renderCommand(),
  }
}


/**
 * 控件库，新增控件
 */
UE.plugins['controllibrary'] = function () {
  var me = this,thePlugins = 'controllibrary';
  me.commands[thePlugins] = {
    execCommand:function () {
      var dialog = new UE.ui.Dialog({
        //弹出模式以iframe方式打开的控件配置页面 URL
        iframeUrl:this.options.UEDITOR_HOME_URL +'dialogs/oak-form/controllibrary.html',
        name:thePlugins,
        editor:this,
        title: '控件库',//弹出框标题
        cssRules:"width:700px;height:350px;",
        buttons:[//弹出框按钮集
          {
            className:'edui-okbutton',
            label:'确定',
            onclick:function () {
              dialog.close(true);
            }
          },
          {
            className:'edui-cancelbutton',
            label:'取消',
            onclick:function () {
              dialog.close(false);
            }
          }]
      });
      dialog.render();
      dialog.open();
    }
  };
};

baidu.editor.ui.controllibrary = function(editor,list,title){

  // 创建dialog
  var kfDialog = new UE.ui.Dialog({

    // 指定弹出层路径
    iframeUrl: editor.options.UEDITOR_HOME_URL +'dialogs/oak-form/controllibrary.html',
    // 编辑器实例
    editor: editor,
    // dialog 名称
    name: 'controllibrary',
    // dialog 标题
    title: '控件库',
    // dialog 外围 css
    cssRules: 'width:700px; height:350px;',

    //如果给出了buttons就代表dialog有确定和取消
    buttons:[
      {
        className:'edui-okbutton',
        label:'确定',
        onclick:function () {
          kfDialog.close(true);
        }
      },
      {
        className:'edui-cancelbutton',
        label:'取消',
        onclick:function () {
          kfDialog.close(false);
        }
      }
    ]});

  editor.ready(function(){
    UE.utils.cssRule('kfformula', 'img.kfformula{vertical-align: middle;}', editor.document);
  });

  var iconUrl = editor.options.UEDITOR_HOME_URL + 'imgs/controllibrary.png';
  var tmpLink = document.createElement('a');
  tmpLink.href = iconUrl;
  tmpLink.href = tmpLink.href;
  iconUrl = tmpLink.href;

  var kfBtn = new UE.ui.Button({
    name: 'controllibrary-1',
    title:'控件库',
    //需要添加的额外样式，指定icon图标
    className:'edui-for-controllibrary-1',
    cssRules :'background-image: url("' + iconUrl + '") !important',
    onclick:function () {
      //渲染dialog
      kfDialog.render();
      kfDialog.open();
    }
  });

  //当点到编辑内容上时，按钮要做的状态反射
  editor.addListener('selectionchange', function () {
    var state = editor.queryCommandState('checkbox');
    if (state == -1) {
      kfBtn.setDisabled(true);
      kfBtn.setChecked(false);
    } else {
      kfBtn.setDisabled(false);
      kfBtn.setChecked(state);
    }
  });
  return kfBtn;
}
/**
 * checkbox
 */
UE.plugins['checkbox'] = function () {
  var me = this,thePlugins = 'checkbox';
  me.commands[thePlugins] = {
    execCommand:function () {
      var dialog = new UE.ui.Dialog({
        //弹出模式以iframe方式打开的控件配置页面 URL
        iframeUrl:this.options.UEDITOR_HOME_URL +'dialogs/oak-form/checkbox.html',
        name:thePlugins,
        editor:this,
        title: '复选框',//弹出框标题
        cssRules:"width:600px;height:300px;",
        buttons:[//弹出框按钮集
          {
            className:'edui-okbutton',
            label:'确定',
            onclick:function () {
              dialog.close(true);
            }
          },
          {
            className:'edui-cancelbutton',
            label:'取消',
            onclick:function () {
              dialog.close(false);
            }
          }]
      });
      dialog.render();
      dialog.open();
    }
  };
  var popup = new baidu.editor.ui.Popup( {
    editor:this,
    content: '',
    className: 'edui-bubble',
    _edittext: function () {
      baidu.editor.plugins[thePlugins].editdom = popup.anchorEl;
      me.execCommand(thePlugins);
      this.hide();
    },
    _delete:function(){
      if( window.confirm('确认删除该控件吗？') ) {
        baidu.editor.dom.domUtils.remove(this.anchorEl,false);
      }
      this.hide();
    }
  } );
  popup.render();

  /**
   * 绑定鼠标经过控件
   * 获取当前所处模式 ['设计模式','编辑模式','只读模式','审阅模式']
   * 设计模式下才显示popup
   **/
  me.addListener('mouseover', function( t, evt ) {
    var pattern = me.body.getAttribute('pattern');  //获取当前模式
    if(pattern && pattern != 'design'){
      return;
    }
    evt = evt || window.event;
    var el = evt.target || evt.srcElement;
    var target = isParentTarget(el,'oakplugin');
    if(!target){
      popup.hide();
      return ;
    }
    var oakplugin = target.getAttribute('oakplugin');
    if (oakplugin==thePlugins) {
      var html = popup.formatHtml(
        '<nobr>'+target.getAttribute('title')+'   复选框: <span onclick=$$._edittext() class="edui-clickable">编辑</span>  <span onclick=$$._delete() class="edui-clickable">删除</span></nobr>' );
      if ( html ) {
        popup.getDom( 'content' ).innerHTML = html;
        popup.anchorEl = target;
        popup.showAnchor( popup.anchorEl );
      } else {
        popup.hide();
      }
    }else{
      popup.hide();
    }
  });

  /**
   * 绑定click事件，只读模式下不可更改复选框/单选框的值
   */
  me.addListener('click',function(t,evt){
    var pattern = me.body.getAttribute('pattern');  //获取当前模式
    evt = evt || window.event;
    var el = evt.target || evt.srcElement;
    var target = isParentTarget(el,'oakplugin');
    if(target && pattern == 'readonly'){
      evt.preventDefault(); //阻止默认行为
      return false;
    }
  })
};

baidu.editor.ui.checkbox = function(editor,list,title){

  // 创建dialog
  var kfDialog = new UE.ui.Dialog({

    // 指定弹出层路径
    iframeUrl: editor.options.UEDITOR_HOME_URL +'dialogs/oak-form/checkbox.html',
    // 编辑器实例
    editor: editor,
    // dialog 名称
    name: 'checkbox',
    // dialog 标题
    title: '插入复选框',
    // dialog 外围 css
    cssRules: 'width:600px; height:300px;',

    //如果给出了buttons就代表dialog有确定和取消
    buttons:[
      {
        className:'edui-okbutton',
        label:'确定',
        onclick:function () {
          kfDialog.close(true);
        }
      },
      {
        className:'edui-cancelbutton',
        label:'取消',
        onclick:function () {
          kfDialog.close(false);
        }
      }
    ]});

  editor.ready(function(){
    UE.utils.cssRule('kfformula', 'img.kfformula{vertical-align: middle;}', editor.document);
  });

  var iconUrl = editor.options.UEDITOR_HOME_URL + 'imgs/checkbox.png';
  var tmpLink = document.createElement('a');
  tmpLink.href = iconUrl;
  tmpLink.href = tmpLink.href;
  iconUrl = tmpLink.href;

  var kfBtn = new UE.ui.Button({
    name: 'checkbox-1',
    title:'插入复选框',
    //需要添加的额外样式，指定icon图标
    className:'edui-for-checkbox-1',
    cssRules :'background-image: url("' + iconUrl + '") !important',
    onclick:function () {
      //渲染dialog
      kfDialog.render();
      kfDialog.open();
    }
  });

  //当点到编辑内容上时，按钮要做的状态反射
  editor.addListener('selectionchange', function () {
    var state = editor.queryCommandState('checkbox');
    if (state == -1) {
      kfBtn.setDisabled(true);
      kfBtn.setChecked(false);
    } else {
      kfBtn.setDisabled(false);
      kfBtn.setChecked(state);
    }
  });
  return kfBtn;
}

/**
 * 单选框控件
 */
UE.plugins['radio'] = function () {
  var me = this,thePlugins = 'radio';
  me.commands[thePlugins] = {
    execCommand:function () {
      var dialog = new UE.ui.Dialog({
        //弹出模式以iframe方式打开的控件配置页面 URL
        iframeUrl:this.options.UEDITOR_HOME_URL +'dialogs/oak-form/radio.html',
        name:thePlugins,
        editor:this,
        title: '单选框',//弹出框标题
        cssRules:"width:600px;height:300px;",
        buttons:[//弹出框按钮集
          {
            className:'edui-okbutton',
            label:'确定',
            onclick:function () {
              dialog.close(true);
            }
          },
          {
            className:'edui-cancelbutton',
            label:'取消',
            onclick:function () {
              dialog.close(false);
            }
          }]
      });
      dialog.render();
      dialog.open();
    }
  };
  var popup = new baidu.editor.ui.Popup( {
    editor:this,
    content: '',
    className: 'edui-bubble',
    _edittext: function () {
      baidu.editor.plugins[thePlugins].editdom = popup.anchorEl;
      me.execCommand(thePlugins);
      this.hide();
    },
    _delete:function(){
      if( window.confirm('确认删除该控件吗？') ) {
        baidu.editor.dom.domUtils.remove(this.anchorEl,false);
      }
      this.hide();
    }
  } );
  popup.render();

  /**
   * 绑定鼠标经过控件
   * 获取当前所处模式 ['设计模式','编辑模式','只读模式','审阅模式']
   * 设计模式下才显示popup
   **/
  me.addListener('mouseover', function( t, evt ) {
    var pattern = me.body.getAttribute('pattern');  //获取当前模式
    if(pattern && pattern != 'design'){
      return;
    }
    evt = evt || window.event;
    var el = evt.target || evt.srcElement;
    var target = isParentTarget(el,'oakplugin');
    if(!target){
      popup.hide();
      return ;
    }
    var oakplugin = target.getAttribute('oakplugin');
    if (oakplugin==thePlugins) {
      var html = popup.formatHtml(
        '<nobr>'+target.getAttribute('title')+'  单选框: <span onclick=$$._edittext() class="edui-clickable">编辑</span>  <span onclick=$$._delete() class="edui-clickable">删除</span></nobr>' );
      if ( html ) {
        popup.getDom( 'content' ).innerHTML = html;
        popup.anchorEl = target;
        popup.showAnchor( popup.anchorEl );
      } else {
        popup.hide();
      }
    }
  });
};

baidu.editor.ui.radio = function(editor,list,title){

  // 创建dialog
  var kfDialog = new UE.ui.Dialog({

    // 指定弹出层路径
    iframeUrl: editor.options.UEDITOR_HOME_URL +'dialogs/oak-form/radio.html',
    // 编辑器实例
    editor: editor,
    // dialog 名称
    name: 'radio',
    // dialog 标题
    title: '插入单选框',
    // dialog 外围 css
    cssRules: 'width:600px; height:300px;',

    //如果给出了buttons就代表dialog有确定和取消
    buttons:[
      {
        className:'edui-okbutton',
        label:'确定',
        onclick:function () {
          kfDialog.close(true);
        }
      },
      {
        className:'edui-cancelbutton',
        label:'取消',
        onclick:function () {
          kfDialog.close(false);
        }
      }
    ]});

  editor.ready(function(){
    UE.utils.cssRule('kfformula', 'img.kfformula{vertical-align: middle;}', editor.document);
  });

  var iconUrl = editor.options.UEDITOR_HOME_URL + 'imgs/radio.png';
  var tmpLink = document.createElement('a');
  tmpLink.href = iconUrl;
  tmpLink.href = tmpLink.href;
  iconUrl = tmpLink.href;

  var kfBtn = new UE.ui.Button({
    name: 'radio-1',
    title:'插入单选框',
    //需要添加的额外样式，指定icon图标
    className:'edui-for-radio-1',
    cssRules :'background-image: url("' + iconUrl + '") !important',
    onclick:function () {
      //渲染dialog
      kfDialog.render();
      kfDialog.open();
    }
  });

  //当点到编辑内容上时，按钮要做的状态反射
  editor.addListener('selectionchange', function () {
    var state = editor.queryCommandState('radio');
    if (state == -1) {
      kfBtn.setDisabled(true);
      kfBtn.setChecked(false);
    } else {
      kfBtn.setDisabled(false);
      kfBtn.setChecked(state);
    }
  });
  return kfBtn;
}


/**
 * 单行文本输入框控件
 */
UE.plugins['input'] = function () {
  var me = this,thePlugins = 'input';
  me.commands[thePlugins] = {
    execCommand:function () {
      var dialog = new UE.ui.Dialog({
        //弹出模式以iframe方式打开的控件配置页面 URL
        iframeUrl:this.options.UEDITOR_HOME_URL +'dialogs/oak-form/input.html',
        name:thePlugins,
        editor:this,
        title: '插入文本域输入',//弹出框标题
        cssRules:"width:500px;height:190px;",
        buttons:[//弹出框按钮集
          {
            className:'edui-okbutton',
            label:'确定',
            onclick:function () {
              dialog.close(true);
            }
          },
          {
            className:'edui-cancelbutton',
            label:'取消',
            onclick:function () {
              dialog.close(false);
            }
          }]
      });
      dialog.render();
      dialog.open();
    }
  };
  var popup = new baidu.editor.ui.Popup( {
    editor:this,
    content: '',
    className: 'edui-bubble',
    _edittext: function () {
      baidu.editor.plugins[thePlugins].editdom = popup.anchorEl;
      me.execCommand(thePlugins);
      this.hide();
    },
    _delete:function(){
      if( window.confirm('确认删除该控件吗？') ) {
        baidu.editor.dom.domUtils.remove(this.anchorEl,false);
      }
      this.hide();
    }
  } );
  popup.render();

  /**
   * 绑定鼠标经过控件
   * 获取当前所处模式 ['设计模式','编辑模式','只读模式','审阅模式']
   * 设计模式下才显示popup
   **/
  me.addListener('mouseover', function( t, evt ) {
    var pattern = me.body.getAttribute('pattern');  //获取当前模式
    if(pattern && pattern != 'design'){
      return;
    }
    evt = evt || window.event;
    var el = evt.target || evt.srcElement;
    var target = isParentTarget(el,'oakplugin');
    if(!target){
      popup.hide();
      return ;
    }
    var oakplugin = target.getAttribute('oakplugin');
    if (oakplugin == thePlugins) {
      var html = popup.formatHtml(
        '<nobr>'+target.getAttribute('title')+'   单行文本输入: <span onclick=$$._edittext() class="edui-clickable">编辑</span>  <span onclick=$$._delete() class="edui-clickable">删除</span></nobr>' );
      if ( html ) {
        popup.getDom( 'content' ).innerHTML = html;
        popup.anchorEl = target;
        popup.showAnchor( popup.anchorEl );
      } else {
        popup.hide();
      }
    }else{
      popup.hide();
    }
  });
};

baidu.editor.ui.input = function(editor,list,title){

  // 创建dialog
  var kfDialog = new UE.ui.Dialog({

    // 指定弹出层路径
    iframeUrl: editor.options.UEDITOR_HOME_URL +'dialogs/oak-form/input.html',
    // 编辑器实例
    editor: editor,
    // dialog 名称
    name: 'input',
    // dialog 标题
    title: '插入文本域输入',
    // dialog 外围 css
    cssRules: 'width:500px; height:190px;',

    //如果给出了buttons就代表dialog有确定和取消
    buttons:[
      {
        className:'edui-okbutton',
        label:'确定',
        onclick:function () {
          kfDialog.close(true);
        }
      },
      {
        className:'edui-cancelbutton',
        label:'取消',
        onclick:function () {
          kfDialog.close(false);
        }
      }
    ]});

  editor.ready(function(){
    UE.utils.cssRule('kfformula', 'img.kfformula{vertical-align: middle;}', editor.document);
  });

  var iconUrl = editor.options.UEDITOR_HOME_URL + 'imgs/input.png';
  var tmpLink = document.createElement('a');
  tmpLink.href = iconUrl;
  tmpLink.href = tmpLink.href;
  iconUrl = tmpLink.href;

  var kfBtn = new UE.ui.Button({
    name: 'input-1',
    title:'文本域输入',
    //需要添加的额外样式，指定icon图标
    className:'edui-for-input-1',
    cssRules :'background-image: url("' + iconUrl + '") !important',
    onclick:function () {
      //渲染dialog
      kfDialog.render();
      kfDialog.open();
    }
  });

  //当点到编辑内容上时，按钮要做的状态反射
  editor.addListener('selectionchange', function () {
    var state = editor.queryCommandState('input');
    if (state == -1) {
      kfBtn.setDisabled(true);
      kfBtn.setChecked(false);
    } else {
      kfBtn.setDisabled(false);
      kfBtn.setChecked(state);
    }
  });
  return kfBtn;
}

/**
 * 多行文本输入框控件
 */
UE.plugins['textarea'] = function () {
  var me = this,thePlugins = 'textarea';
  me.commands[thePlugins] = {
    execCommand:function () {
      var dialog = new UE.ui.Dialog({
        //弹出模式以iframe方式打开的控件配置页面 URL
        iframeUrl:this.options.UEDITOR_HOME_URL +'dialogs/oak-form/textarea.html',
        name:thePlugins,
        editor:this,
        title: '插入多行文本输入',//弹出框标题
        cssRules:"width:600px;height:200px;",
        buttons:[//弹出框按钮集
          {
            className:'edui-okbutton',
            label:'确定',
            onclick:function () {
              dialog.close(true);
            }
          },
          {
            className:'edui-cancelbutton',
            label:'取消',
            onclick:function () {
              dialog.close(false);
            }
          }]
      });
      dialog.render();
      dialog.open();
    }
  };
  var popup = new baidu.editor.ui.Popup( {
    editor:this,
    content: '',
    className: 'edui-bubble',
    _edittext: function () {
      baidu.editor.plugins[thePlugins].editdom = popup.anchorEl;
      me.execCommand(thePlugins);
      this.hide();
    },
    _delete:function(){
      if( window.confirm('确认删除该控件吗？') ) {
        baidu.editor.dom.domUtils.remove(this.anchorEl,false);
      }
      this.hide();
    }
  } );
  popup.render();

  /**
   * 绑定鼠标经过控件
   * 获取当前所处模式 ['设计模式','编辑模式','只读模式','审阅模式']
   * 设计模式下才显示popup
   **/
  me.addListener('mouseover', function( t, evt ) {
    var pattern = me.body.getAttribute('pattern');  //获取当前模式
    if(pattern != 'design'){
      return;
    }
    evt = evt || window.event;
    var el = evt.target || evt.srcElement;
    var target = isParentTarget(el,'oakplugin');
    if(!target){
      popup.hide();
      return ;
    }
    var oakplugin = target.getAttribute('oakplugin');
    if (oakplugin==thePlugins) {
      var html = popup.formatHtml(
        '<nobr>'+target.getAttribute('title')+'  多行文本输入: <span onclick=$$._edittext() class="edui-clickable">编辑</span>  <span onclick=$$._delete() class="edui-clickable">删除</span></nobr>' );
      if ( html ) {
        popup.getDom( 'content' ).innerHTML = html;
        popup.anchorEl = target;
        popup.showAnchor( popup.anchorEl );
      } else {
        popup.hide();
      }
    }
  });
};

baidu.editor.ui.textarea = function(editor,list,title){

  // 创建dialog
  var kfDialog = new UE.ui.Dialog({

    // 指定弹出层路径
    iframeUrl: editor.options.UEDITOR_HOME_URL +'dialogs/oak-form/textarea.html',
    // 编辑器实例
    editor: editor,
    // dialog 名称
    name: 'textarea',
    // dialog 标题
    title: '多行文本输入',
    // dialog 外围 css
    cssRules: 'width:500px; height:200px;',

    //如果给出了buttons就代表dialog有确定和取消
    buttons:[
      {
        className:'edui-okbutton',
        label:'确定',
        onclick:function () {
          kfDialog.close(true);
        }
      },
      {
        className:'edui-cancelbutton',
        label:'取消',
        onclick:function () {
          kfDialog.close(false);
        }
      }
    ]});

  editor.ready(function(){
    UE.utils.cssRule('kfformula', 'img.kfformula{vertical-align: middle;}', editor.document);
  });

  var iconUrl = editor.options.UEDITOR_HOME_URL + 'imgs/textarea.png';
  var tmpLink = document.createElement('a');
  tmpLink.href = iconUrl;
  tmpLink.href = tmpLink.href;
  iconUrl = tmpLink.href;

  var kfBtn = new UE.ui.Button({
    name: 'textarea-1',
    title:'插入多行文本输入',
    //需要添加的额外样式，指定icon图标
    className:'edui-for-textarea-1',
    cssRules :'background-image: url("' + iconUrl + '") !important',
    onclick:function () {
      //渲染dialog
      kfDialog.render();
      kfDialog.open();
    }
  });

  //当点到编辑内容上时，按钮要做的状态反射
  editor.addListener('selectionchange', function () {
    var state = editor.queryCommandState('textarea');
    if (state == -1) {
      kfBtn.setDisabled(true);
      kfBtn.setChecked(false);
    } else {
      kfBtn.setDisabled(false);
      kfBtn.setChecked(state);
    }
  });
  return kfBtn;
}

/**
 * select下拉框输入框控件
 */
UE.plugins['select'] = function () {
  var me = this,thePlugins = 'select';
  me.commands[thePlugins] = {
    execCommand:function () {
      var dialog = new UE.ui.Dialog({
        //弹出模式以iframe方式打开的控件配置页面 URL
        iframeUrl:this.options.UEDITOR_HOME_URL +'dialogs/oak-form/select.html',
        name:thePlugins,
        editor:this,
        title: '插入下拉框',//弹出框标题
        cssRules:"width:600px;height:300px;",
        buttons:[//弹出框按钮集
          {
            className:'edui-okbutton',
            label:'确定',
            onclick:function () {
              dialog.close(true);
            }
          },
          {
            className:'edui-cancelbutton',
            label:'取消',
            onclick:function () {
              dialog.close(false);
            }
          }]
      });
      dialog.render();
      dialog.open();
    }
  };
  var popup = new baidu.editor.ui.Popup( {
    editor:this,
    content: '',
    className: 'edui-bubble',
    _edittext: function () {
      baidu.editor.plugins[thePlugins].editdom = popup.anchorEl;
      me.execCommand(thePlugins);
      this.hide();
    },
    _delete:function(){
      if( window.confirm('确认删除该控件吗？') ) {
        baidu.editor.dom.domUtils.remove(this.anchorEl,false);
      }
      this.hide();
    }
  } );
  popup.render();

  /**
   * 绑定鼠标经过控件
   * 获取当前所处模式 ['设计模式','编辑模式','只读模式','审阅模式']
   * 设计模式下才显示popup
   **/
  me.addListener('mouseover', function( t, evt ) {
    var pattern = me.body.getAttribute('pattern');  //获取当前模式
    if(pattern && pattern != 'design'){
      return;
    }
    evt = evt || window.event;
    var el = evt.target || evt.srcElement;
    var target = isParentTarget(el,'oakplugin');
    var parentSelect = isParentTarget(el,'data-type');
    if(!target || parentSelect){
      popup.hide();
      return ;
    }
    var oakplugin = target.getAttribute('oakplugin');
    if (oakplugin==thePlugins && !parentSelect) {
      var html = popup.formatHtml(
        '<nobr>'+target.getAttribute('title')+'   下拉框: <span onclick=$$._edittext() class="edui-clickable">编辑</span>  <span onclick=$$._delete() class="edui-clickable">删除</span></nobr>' );
      if ( html ) {
        popup.getDom( 'content' ).innerHTML = html;
        popup.anchorEl = target;
        popup.showAnchor( popup.anchorEl );
      } else {
        popup.hide();
      }
    }
  });

  //绑定鼠标单击控件  实现自定义下拉列表
  me.addListener('click', function( t, evt ) {
    var pattern = me.body.getAttribute('pattern');  //获取当前模式
    if(pattern && pattern == 'readonly'){
      return;
    }
    evt = evt || window.event;
    var el = evt.target || evt.srcElement;
    var target = isParentTarget(el,'oakplugin');
    var parentSelect = isParentTarget(el,'data-type');
    //隐藏所有下拉选框
    var body = getBodyTarget(el);
    try{
      var oakSelect = body.getElementsByClassName('oak-select-root');
      for(var i=0;i<oakSelect.length;i++){
        oakSelect[i].style.display="none";
      }
    }catch (err){};

    if(!target){
       return ;
    }

    var model = eval("("+(target.getAttribute('obj'))+")")||{};
    var selectValue = model.defaultValue;
    var bindData = model.bindData||[];
    if(model.type != 'select'||bindData.length==0){
      return ;
    }
    if(target.getElementsByClassName("oak-select-root").length==0){
      var selectEl = document.createElement('div');
      selectEl.className = "oak-field oak-select-root";
      var html = '<div class="oak-select-content oak-field"><ul class="oak-select oak-field" data-type="select">'; //生成html
      for(var i=0;i<bindData.length;i++){
        html += '<li class="'+(bindData[i].SELECTED?'selected oak-field':'oak-field')+'" value="'+bindData[i].VALUE+'" title="'+bindData[i].TEXT+'">'+bindData[i].TEXT+'</li>'
      }
      html += '</ul></div>';
      selectEl.innerHTML = html;
      target.appendChild(selectEl);
    }else{
      target.getElementsByClassName('oak-select-root')[0].style.display="";
    }
    //实现下拉选中
    if(parentSelect){
       var allLis = parentSelect.getElementsByTagName('li');
       for(var i=0;i<allLis.length;i++){
         allLis[i].className = 'oak-field';
       }
       selectValue = el.getAttribute('title');
       el.className = 'oak-field selected';
       target.getElementsByClassName('oak-field-value')[0].innerHTML = selectValue;
       target.getElementsByClassName('oak-select-root')[0].style.display="none";
    }
  });
};

baidu.editor.ui.select = function(editor,list,title){

  // 创建dialog
  var kfDialog = new UE.ui.Dialog({

    // 指定弹出层路径
    iframeUrl: editor.options.UEDITOR_HOME_URL +'dialogs/oak-form/select.html',
    // 编辑器实例
    editor: editor,
    // dialog 名称
    name: 'select',
    // dialog 标题
    title: '插入下拉框',
    // dialog 外围 css
    cssRules: 'width:600px; height:300px;',

    //如果给出了buttons就代表dialog有确定和取消
    buttons:[
      {
        className:'edui-okbutton',
        label:'确定',
        onclick:function () {
          kfDialog.close(true);
        }
      },
      {
        className:'edui-cancelbutton',
        label:'取消',
        onclick:function () {
          kfDialog.close(false);
        }
      }
    ]});

  editor.ready(function(){
    UE.utils.cssRule('kfformula', 'img.kfformula{vertical-align: middle;}', editor.document);
  });

  var iconUrl = editor.options.UEDITOR_HOME_URL + 'imgs/select.png';
  var tmpLink = document.createElement('a');
  tmpLink.href = iconUrl;
  tmpLink.href = tmpLink.href;
  iconUrl = tmpLink.href;

  var kfBtn = new UE.ui.Button({
    name: 'select-1',
    title:'下拉框',
    //需要添加的额外样式，指定icon图标
    className:'edui-for-select-1',
    cssRules :'background-image: url("' + iconUrl + '") !important',
    onclick:function () {
      //渲染dialog
      kfDialog.render();
      kfDialog.open();
    }
  });

  //当点到编辑内容上时，按钮要做的状态反射
  editor.addListener('selectionchange', function () {
    var state = editor.queryCommandState('select');
    if (state == -1) {
      kfBtn.setDisabled(true);
      kfBtn.setChecked(false);
    } else {
      kfBtn.setDisabled(false);
      kfBtn.setChecked(state);
    }
  });
  return kfBtn;
}


/**
 * timeinput时间输入框控件
 */
UE.plugins['timeinput'] = function () {
  var me = this,thePlugins = 'timeinput';
  me.commands[thePlugins] = {
    execCommand:function () {
      var dialog = new UE.ui.Dialog({
        //弹出模式以iframe方式打开的控件配置页面 URL
        iframeUrl:this.options.UEDITOR_HOME_URL +'dialogs/oak-form/timeinput.html',
        name:thePlugins,
        editor:this,
        title: '插入日期输入框',//弹出框标题
        cssRules:"width:540px;height:250px;",
        buttons:[//弹出框按钮集
          {
            className:'edui-okbutton',
            label:'确定',
            onclick:function () {
              dialog.close(true);
            }
          },
          {
            className:'edui-cancelbutton',
            label:'取消',
            onclick:function () {
              dialog.close(false);
            }
          }]
      });
      dialog.render();
      dialog.open();
    }
  };
  var popup = new baidu.editor.ui.Popup( {
    editor:this,
    content: '',
    className: 'edui-bubble',
    _edittext: function () {
      baidu.editor.plugins[thePlugins].editdom = popup.anchorEl;
      me.execCommand(thePlugins);
      this.hide();
    },
    _delete:function(){
      if( window.confirm('确认删除该控件吗？') ) {
        baidu.editor.dom.domUtils.remove(this.anchorEl,false);
      }
      this.hide();
    }
  } );
  popup.render();

  /**
   * 绑定鼠标经过控件
   * 获取当前所处模式 ['设计模式','编辑模式','只读模式','审阅模式']
   * 设计模式下才显示popup
   **/
  me.addListener('mouseover', function( t, evt ) {
    var pattern = me.body.getAttribute('pattern');  //获取当前模式
    if(pattern && pattern != 'design'){
      return;
    }
    evt = evt || window.event;
    var el = evt.target || evt.srcElement;
    var target = isParentTarget(el,'oakplugin');
    if(!target){
      popup.hide();
      return ;
    }
    var oakplugin = target.getAttribute('oakplugin');
    if (oakplugin==thePlugins) {
      var html = popup.formatHtml(
        '<nobr>'+target.getAttribute('title')+'   日期输入框: <span onclick=$$._edittext() class="edui-clickable">编辑</span>  <span onclick=$$._delete() class="edui-clickable">删除</span></nobr>' );
      if ( html ) {
        popup.getDom( 'content' ).innerHTML = html;
        popup.anchorEl = target;
        popup.showAnchor( popup.anchorEl );
      } else {
        popup.hide();
      }
    }
  });
  var body = me.body;
  //绑定鼠标单击控件 绑定在dom元素上
  me.addListener('click', function(t, evt ) {
    evt = evt || window.event;
    var el = evt.target || evt.srcElement;
    var target = isParentTarget(el,'oakplugin');
    var bindClick = el.getAttribute('bindclick');
    if(target && bindClick){
       var obj = eval("("+target.getAttribute('obj')+")");

    }
  });
};

baidu.editor.ui.timeinput = function(editor,list,title){

  // 创建dialog
  var kfDialog = new UE.ui.Dialog({

    // 指定弹出层路径
    iframeUrl: editor.options.UEDITOR_HOME_URL +'dialogs/oak-form/timeinput.html',
    // 编辑器实例
    editor: editor,
    // dialog 名称
    name: 'timeinput',
    // dialog 标题
    title: '插入时间输入控件',
    // dialog 外围 css
    cssRules: 'width:540px; height:250px;',

    //如果给出了buttons就代表dialog有确定和取消
    buttons:[
      {
        className:'edui-okbutton',
        label:'确定',
        onclick:function () {
          kfDialog.close(true);
        }
      },
      {
        className:'edui-cancelbutton',
        label:'取消',
        onclick:function () {
          kfDialog.close(false);
        }
      }
    ]});

  editor.ready(function(){
    UE.utils.cssRule('kfformula', 'img.kfformula{vertical-align: middle;}', editor.document);
  });

  var iconUrl = editor.options.UEDITOR_HOME_URL + 'imgs/timeinput.png';
  var tmpLink = document.createElement('a');
  tmpLink.href = iconUrl;
  tmpLink.href = tmpLink.href;
  iconUrl = tmpLink.href;

  var kfBtn = new UE.ui.Button({
    name: 'timeinput-1',
    title:'日期输入框',
    //需要添加的额外样式，指定icon图标
    className:'edui-for-timeinput-1',
    cssRules :'background-image: url("' + iconUrl + '") !important',
    onclick:function () {
      //渲染dialog
      kfDialog.render();
      kfDialog.open();
    }
  });

  //当点到编辑内容上时，按钮要做的状态反射
  editor.addListener('selectionchange', function () {
    var state = editor.queryCommandState('select');
    if (state == -1) {
      kfBtn.setDisabled(true);
      kfBtn.setChecked(false);
    } else {
      kfBtn.setDisabled(false);
      kfBtn.setChecked(state);
    }
  });
  return kfBtn;
}

/**
 * 获取页面所有控件
 */
UE.plugins['allwidgets'] = function () {
  var me = this, thePlugins = 'allwidgets';
  me.commands[thePlugins] = {
    execCommand: function () {
      var $body = this.body;
      // 获取id为oakplgin的对象
      var $children = $body.getElementsByClassName('oakplugin');
      var widgets = [];
      for(var i=0;i<$children.length;i++){
        var obj = $children[i].getAttribute('obj');
        var oakplugin = $children[i].getAttribute('oakplugin');
        var value;
        if(oakplugin == 'input' || oakplugin == 'select'){
          var target = $children[i].getElementsByClassName('oak-field-value')[0];
          value = target.innerText;
        }else if(oakplugin == 'timeinput'){
          var target = $children[i].getElementsByTagName('input')[1];
          value = target.value;
        }else if(oakplugin == 'checkbox'||oakplugin == 'radio'){
          var inputs = $children[i].getElementsByTagName('input');
          value = [];
          for(var j=0;j<inputs.length;j++){
            if(inputs[j].checked){
              value.push(inputs[j].value)
            }
          }
        }
        widgets.push({
          value : value,
          data : obj,
        })
      }
      return widgets;
    }
  };
}
baidu.editor.ui.allwidgets = function(editor,list,title){
  var iconUrl = editor.options.UEDITOR_HOME_URL + 'imgs/allwidgets.png';
  var tmpLink = document.createElement('a');
  tmpLink.href = iconUrl;
  tmpLink.href = tmpLink.href;
  iconUrl = tmpLink.href;

  var kfBtn = new UE.ui.Button({
    name: 'allwidgets-1',
    title:'获取所有控件',
    //需要添加的额外样式，指定icon图标
    className:'edui-for-allwidgets-1',
    onclick:function () {
      editor.execCommand('allwidgets');
    }
  });

  //当点到编辑内容上时，按钮要做的状态反射
  editor.addListener('selectionchange', function () {
    var state = editor.queryCommandState('select');
    if (state == -1) {
      kfBtn.setDisabled(true);
      kfBtn.setChecked(false);
    } else {
      kfBtn.setDisabled(false);
      kfBtn.setChecked(state);
    }
  });
  return kfBtn;
}
/**
 * 获取页面所有控件
 */
UE.plugins['allhtml'] = function () {
  var me = this, thePlugins = 'allhtml';
  me.commands[thePlugins] = {
    execCommand: function () {
      console.log(me.getContent())
      return me.getAllHtml();
    }
  };
}
baidu.editor.ui.allhtml = function(editor,list,title){
  var iconUrl = editor.options.UEDITOR_HOME_URL + 'imgs/allhtml.png';
  var tmpLink = document.createElement('a');
  tmpLink.href = iconUrl;
  tmpLink.href = tmpLink.href;
  iconUrl = tmpLink.href;

  var kfBtn = new UE.ui.Button({
    name: 'allhtml-1',
    title:'获取编辑器html',
    //需要添加的额外样式，指定icon图标
    className:'edui-for-allhtml-1',
    onclick:function () {
      editor.execCommand('allhtml');
    }
  });

  //当点到编辑内容上时，按钮要做的状态反射
  editor.addListener('selectionchange', function () {
    var state = editor.queryCommandState('select');
    if (state == -1) {
      kfBtn.setDisabled(true);
      kfBtn.setChecked(false);
    } else {
      kfBtn.setDisabled(false);
      kfBtn.setChecked(state);
    }
  });
  return kfBtn;
}