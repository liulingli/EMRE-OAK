/**
 * Created by liulingli on 2017/7/10.
 * desc 电子病历编辑器
 */
import React,{Component} from 'react';
import classNames from 'classnames';
import Tab from './common/tab';
import innerHtml from './innerHtml';
import VestigeReservation from './vestigeReservation';

export default class Ueditor extends Component {
  type = ["设计模式","编辑模式","只读模式","审阅模式"];
  componentWillMount(){
    this.state = {
      editor : undefined,
      index : 0,
      type : true, //纵向
      width : 700,
      actualChange : []
    }
  }
  componentDidMount(){
    let that = this;
    let {id} = this.props;
    let editor = UE.getEditor(id,{
      initialFrameWidth : '100%',
    });
    editor.ready(function() {
      editor.setContent(innerHtml, true);
    });
    let before = window.top.changes;
    editor.addListener('focus', function( editor ) {
      let beforeChanges = before;
      let changes = window.top.changes||[];
      if(beforeChanges != changes){
        that.showChange(changes);
      }
    });
    setTimeout(()=>{
      let html = command(editor);
      this.setState({
        editor : editor,
        editHtml : html.editHtml,
        fixedHtml : html.fixedHtml,
        insertHtml : html.insertHtml,
        emreHtml : html.emreHtml,
        layoutHtml : html.layout
      });
    },200);
  }
  showChange = (changes) =>{
     let actualChange = [];
     for(let i=0;i<changes.length;i++){
       if(changes[i]){
         actualChange.push(changes[i]);
       }
     }
     this.setState({
      actualChange : actualChange
     })
  }
  insertTable = (e) => {
    let {editor} = this.state;
    let tablePicker = new baidu.editor.ui.TablePicker({
         editor:editor,
         onpicktable: function (t, numCols, numRows){
           editor.execCommand('inserttable', {numRows:numRows, numCols:numCols, border:1});
       }
     });
     let tablePop = new baidu.editor.ui.Popup({
         editor:editor,
         content:tablePicker
     });
     tablePop.showAnchor(e.target);
  }
  /**
   * @method 切换视图模式
   * @param index
   */
  onClick = (index) =>{
    this.setState({
      index : index
    });
    let type = this.type[index];
    switch (type){
      case "设计模式" : this.designPattern();break;
      case "编辑模式" : this.editPattern();break;
      case "只读模式" : this.readonlyPattern();break;
      case "审阅模式" : this.reviewPattern();break;
    }
  }
  /**
   * @method 设计模式
   */
  designPattern = ()=> {
    let editor = this.state.editor;
    editor.body.setAttribute('pattern','design');
    //editor.body.setAttribute('contenteditable','true');
    editor.setEnabled();
  }

  /**
   * @method 编辑模式
   */
  editPattern = ()=> {
    let editor = this.state.editor;
    editor.body.setAttribute('pattern','edit');
    //editor.body.setAttribute('contenteditable','false');
    editor.setDisabled();
  }

  /**
   * @method 只读模式
   */
  readonlyPattern = ()=> {
    let editor = this.state.editor;
    editor.body.setAttribute('pattern','readonly');
    //editor.body.setAttribute('contenteditable','false');
    editor.setDisabled();
  }

  /**
   * @method 审阅模式
   */
  reviewPattern = ()=> {
    let editor = this.state.editor;
    editor.body.setAttribute('pattern','review');
    //editor.body.setAttribute('contenteditable','false');
    //editor.setDisabled();
    editor.setEnabled();
  }
  /**
   * 纸张方向
   */
  layout = (type)=>{
    this.setState({
      width : type?700:1000,
      type : type
    });
    let editor = this.state.editor;
    let head = editor.window.document.getElementsByTagName('head')[0];
    let cssStyle = document.createElement('style');
    cssStyle.id = 'layout';
    cssStyle.innerText = '@page { size: landscape; }';
    if(!type){
      head.appendChild(cssStyle);
    }else{
      let cssStyle = editor.window.document.getElementById('layout');
      head.removeChild(cssStyle);
    }
  }
  render () {
    let {id} = this.props;
    let {actualChange,type,width,editor,html,index,fixedHtml,editHtml,emreHtml,insertHtml,layoutHtml} = this.state;
    let style = {height:'auto',width:width};
    return (
      <div className="ueditor-oak">
        <div className="ueditor-toobar-oak">
          <Tab
            tabs={["编辑","插入","页面布局","病历控件",'视图模式']}
            fixed={<li className="tab-list-item theme">EMRA-OAK</li>}
          >
            <div className="edui-default">
              <div className="edui-toolbar" dangerouslySetInnerHTML={{__html: editHtml}}/>
            </div>
            <div className="edui-default">
              <div className="edui-toolbar" dangerouslySetInnerHTML={{__html: insertHtml}}/>
            </div>
            <div className="edui-default">
             {/* <div className="edui-toolbar" dangerouslySetInnerHTML={{__html: layoutHtml}}/>*/}
              <div className="edui-toolbar">
                <div className="edui-box edui-button edui-for-orient">
                  <div className={type?"":"edui-state-hover"} onClick={this.layout.bind(this,false)}>
                    <div className="edui-button-wrap">
                      <div unselectable="on" title="横向" className="edui-button-body">
                        <div className="edui-box edui-icon"/>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="edui-box edui-button edui-for-portrait">
                  <div className={type?"edui-state-hover":""} onClick={this.layout.bind(this,true)}>
                    <div className="edui-button-wrap">
                      <div unselectable="on" title="纵向" className="edui-button-body">
                        <div className="edui-box edui-icon"/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="edui-default">
              <div className="edui-toolbar" dangerouslySetInnerHTML={{__html: emreHtml}}/>
            </div>
            <div className="edui-default">
              <div className="edui-toolbar">
                {
                  this.type.map((v,i)=>{
                    return  <div key={i} className={classNames("edui-button-oak",index===i?"active":"")} title={v} onClick={this.onClick.bind(this,i)}>{v}</div>
                  })
                }
              </div>
            </div>
          </Tab>
          <div className="fixed-toobar">
            <div className="edui-default">
              <div className="edui-toolbar" dangerouslySetInnerHTML={{__html: fixedHtml}}/>
            </div>
          </div>
        </div>
        <div className="ueditor-content-oak">
          <div className="ueditor-content" style={style}>
            <script className="ueditor-script-oak" id={id} style={{width:'100%'}} name="content" type="text/plain" />
          </div>
        </div>
        <VestigeReservation marks={actualChange} isShow={true} />
      </div>

    )
  }
}
