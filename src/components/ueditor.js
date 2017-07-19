/**
 * Created by liulingli on 2017/7/10.
 * desc 电子病历编辑器
 */
import React,{Component} from 'react';
import classNames from 'classnames';
import Tab from './common/tab';

export default class Ueditor extends Component {
  type = ['设计模式','编辑模式','按钮模式','只读模式'];
  componentWillMount(){
    this.state = {
      editor : undefined,
      index : 0,
    }
  }
  componentDidMount(){
    let {id} = this.props;
    let editor = UE.getEditor(id);
    setTimeout(()=>{
      let html = command(editor);
      this.setState({
        editor : editor,
        editHtml : html.editHtml,
        fixedHtml : html.fixedHtml,
        insertHtml : html.insertHtml,
        emreHtml : html.emreHtml
      });
    },200)
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
  onClick = (index) =>{
    this.setState({
      index : index
    })
  }
  render () {
    let {id,style} = this.props;
    let {html,index,fixedHtml,editHtml,emreHtml,insertHtml} = this.state;
    return (
      <div className="ueditor-oak">
        <div className="ueditor-toobar-oak">
          <Tab
            tabs={["编辑","插入","病历控件",'编辑模式']}
            fixed={<li className="tab-list-item theme">EMRA-OAK</li>}
          >
            <div className="edui-default">
              <div className="edui-toolbar" dangerouslySetInnerHTML={{__html: editHtml}}/>
            </div>
            <div className="edui-default">
              <div className="edui-toolbar" dangerouslySetInnerHTML={{__html: insertHtml}}/>
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
          <script className="ueditor-script-oak" id={id} style={style} name="content" type="text/plain">
            护理模板编辑器
          </script>
        </div>
      </div>

    )
  }
}
