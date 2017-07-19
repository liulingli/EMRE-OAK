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
  'undo', 'redo', 'formatmatch','removeformat','|','print','preview','searchreplace',
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
        html += "<div class='edui-box edui-separator  edui-default'></div>"
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
 * @method 判断该节点或者所有父节点中是否包含oakplugin属性,有则返回节点,没有返回fasle
 * 元素有oak-field属性才判断
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
document.addEventListener("click",function(e){

})


