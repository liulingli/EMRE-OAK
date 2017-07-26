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

/** 对Date的扩展，将 Date 转化为指定格式的String
 * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 * 例子：
 * (new Date()).Format("yyyy-MM-dd HH:mm:ss.S") ==> 2006-07-02 08:09:04.423
 * (new Date()).Format("yyyy-M-d H:m:s.S")      ==> 2006-7-2 8:9:4.18
*/
Date.prototype.format = function (fmt) { //author: meizz
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "H+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

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
       window.top.allwidgets = allwidgets;
     })
  }
  this.showChange = function(){
     var that = this;
     window.top.changes = that.changes;
     that.editor.focus();
  }
}
ChangeWidget.prototype = {
    change:function(){
      var allwidgets = window.top.allwidgets||this.allwidgets;
      //绑定事件
      for(var i=0;i<allwidgets.length;i++){
        var widget = allwidgets[i];
        var type = widget.type;
        var target = widget.target;
        var value = widget.value;
        switch (type){
          case 'input' : this.inputChange(target,value,i);break;
          case 'select' : this.selectChange(target,value,i);break;
          case 'timeinput' : this.timeinputChange(target,value,i);break;
          case 'checkbox' : this.checkboxChange(target,value,i);break;
          case 'radio' : this.radioChange(target,value,i);break;
          default:break;
        }
      }
    },
    inputChange : function(target,value,key){ //input控件监听
      var that = this;
      var oldValue = value;
      /* 用定时器监听，节流，优化效率 */
      var timer = null;
      function diff(oldValue,newValue){
        var time = new Date().format("yyyy-MM-dd HH:mm:ss");
        if(newValue != oldValue && newValue!=''){
          that.changes[key] = {
            date : time,
            author : '刘伶俐',
            type : '修改了内容',
            desc : oldValue+'修改成'+newValue
          };
        }else if(newValue != oldValue && newValue==''){
          that.changes[key] = {
            date : time,
            author : '刘伶俐',
            type : '删除了内容',
            desc : '删除'+oldValue
          };
        }
        that.showChange();
      }
      target.addEventListener('keyup',function(e){
        var newValue = e.target.innerHTML;
        clearTimeout(timer)
        timer = setTimeout(function(){
          diff(oldValue,newValue)
        },400);
      });

    },
    selectChange : function (target,value,key){ // slect下拉控件监听
      var that = this;
      var oldValue = value;
      target.addEventListener('click',function(e){
        var className = e.target.className||'';
        if(className.indexOf('li') > -1){
           newValue = e.target.innerText;
           if(oldValue != newValue){ //改变
             var time = new Date().format("yyyy-MM-dd HH:mm:ss");
             that.changes[key] = {
               date : time,
               author : '刘伶俐',
               type : '修改了内容',
               desc : oldValue+'修改成'+newValue
             };
             that.showChange();
           }
        }
      });
    },
    timeinputChange : function (target,value,key){
      var that = this;
      var oldValue = value;
      var input = target.getElementsByTagName('input')[1];
      var _my97DP = $dp.focusArr[0] ;
      _my97DP.addEventListener('click',function(e){
         var newValue = input.value;
         if(newValue != oldValue){
           var time = new Date().format("yyyy-MM-dd HH:mm:ss");
           that.changes[key] = {
             date : time,
             author : '刘伶俐',
             type : '修改了时间',
             desc : oldValue+'修改成'+newValue
           };
           that.showChange();
         }
      })
    },
    checkboxChange : function (target,value,key){
      var that = this;
      var oldValue = value;
      target.addEventListener('click',function(e){
        if(e.target.tagName == 'INPUT'){
           //查找所有input[type='checkbox'的元素]
          var newValue = [];
          var input = target.getElementsByTagName('input');
          for(var i=0;i<input.length;i++){
            if(input[i].checked){
              newValue.push(input[i].value);
            }
          }
          if(newValue != oldValue){
            var time = new Date().format("yyyy-MM-dd HH:mm:ss");
            that.changes[key] = {
              date : time,
              author : '刘伶俐',
              type : '修改',
              desc : oldValue+'修改成'+ newValue
            };
            that.showChange();
          }
        }
        //this.showChange();
      })
    },
    radioChange : function (target,value,key){
      var that = this;
      var oldValue = value;
      target.addEventListener('click',function(e){
        if(e.target.tagName == 'INPUT'){
          //查找所有input[type='checkbox'的元素]
          var newValue = [];
          var input = target.getElementsByTagName('input');
          for(var i=0;i<input.length;i++){
            if(input[i].checked){
              newValue.push(input[i].value);
            }
          }
          if(newValue != oldValue){
            var time = new Date().format("yyyy-MM-dd HH:mm:ss");
            that.changes[key] = {
              date : time,
              author : '刘伶俐',
              type : '修改',
              desc : oldValue+'修改成'+ newValue
            };
            that.showChange();
          }
        }
        //this.showChange();
      })
    }
};

function ceshi(){
  console.log(ceshi)
}

