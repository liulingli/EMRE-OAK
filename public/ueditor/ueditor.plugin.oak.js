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
  //绑定鼠标经过控件
  me.addListener( 'mouseover', function( t, evt ) {
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
  //绑定鼠标经过控件
  me.addListener('mouseover', function( t, evt ) {
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
  //绑定鼠标经过控件
  me.addListener( 'mouseover', function( t, evt ) {
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
  //绑定鼠标经过控件
  me.addListener( 'mouseover', function( t, evt ) {
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
  //绑定鼠标经过控件
  me.addListener( 'mouseover', function( t, evt ) {
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

    var model = eval("("+(target.getAttribute('obj')||{})+")");
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
        html += '<li class="'+(bindData[i].selected?'selected oak-field':'oak-field')+'" title="'+bindData[i].value+'">'+bindData[i].value+'</li>'
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
  //绑定鼠标经过控件
  me.addListener( 'mouseover', function( t, evt ) {
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
  //绑定鼠标单击控件
  me.addListener( 'click', function( t, evt ) {
    evt = evt || window.event;
    var el = evt.target || evt.srcElement;
    var target = isParentTarget(el,'oakplugin');
   // var obj = target.getAttribute('obj');
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