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
  var widget = new ChangeWidget();
  widget.init();
  widget.change();
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
     var that = this;
     that.editor.ready(function(){
       var allwidgets = this.execCommand('allwidgets');
       that.allwidgets = allwidgets;
     })
  }
}
ChangeWidget.prototype = {
    change:function(){
      var allwidgets = this.allwidgets;
      //绑定事件
      for(var i=0;i<allwidgets.length;i++){
        var widget = allwidgets[i];
        var type = widget.type;
        var target = widget.target;
        var value = widget.value;
        switch (type){
          case 'input' : this.inputChange(target,value);break;
          case 'select' : this.selectChange(target,value);break;
          case 'timeinput' : this.timeinputChange(target,value);break;
          case 'checkbox' : this.checkboxChange(target,value);break;
          case 'radio' : this.radioChange(target,value);break;
          default:break;
        }
      }
    },
    inputChange : function(target,value){ //input控件监听
      var oldValue = value;
      /* 用定时器监听，节流，优化效率 */
      var timer = null;

      function diff(oldValue,newValue){
        console.log(oldValue+"~"+newValue)
      }
      target.addEventListener('keyup',function(e){
        var newValue = e.target.innerHTML;
        clearTimeout(timer)
        timer = setTimeout(function(){
          diff(oldValue,newValue)
        },400)
      });

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

