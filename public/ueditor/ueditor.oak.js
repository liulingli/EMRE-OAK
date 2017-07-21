/**
 * Created by liulingli on 2017/7/21.
 * desc OAK电子病历编辑器，事件绑定 ，实现痕迹保留
 * 痕迹保留实现思路
 * 电子病历编辑器中只有审阅模式可以操作痕迹保留，
 * 审阅模式下以控件值的改变来判断是否改变
 * 控件类型目前包含单选控件、多选控件、下拉控件、文本域、时间控件
 */

/**
 * @method 分别给不同的控件绑定方法
 * @param
 */

/**
 *
 */
window.onload = function(){
  document.body.addEventListener('click',function(e){
    //console.log(e.target)
  })
  var widget = new ChangeWidget();
  widget.init();
}

function ChangeWidget(){
  /**
   * 改变格式
   * this.changes = [{
   *   date : '2017-07-21 18:40:21',
   *   author : '刘伶俐',
   *   type : '插入了内容'
   *   desc : '知乎'
   * }];
   */
  this.changes = [];
  this.allwidgets = [];
  this.editor = window.top.UE.getEditor('ueditor'); //获取编辑器实例
  /* 获取编辑器内所有控件的原始值 */
  this.init = function (){
     this.editor.ready(function(){
       var allwidgets = this.execCommand('allwidgets');
       this.allwidgets = allwidgets;
       console.log(this.allwidgets)
     })
  }
}
ChangeWidget.prototype = {
    inputChange : function(){

    },
    selectChange : function (){

    },
    timeinputChange : function (){

    },
    checkboxChange : function (){

    },
    radioChange : function (){

    }
};

