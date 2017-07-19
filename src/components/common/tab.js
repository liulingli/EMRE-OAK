/**
 * Created by liulingli on 2017/7/14.
 * desc 通用组件 - tab选项卡
 */
import React,{Component} from 'react';
import classNames from "classnames";

export default class Tab extends Component{
  constructor(props){
    super(props);
    this.state= {
      index : 0 //默认当前显示
    }
  }
  onClick = (i) =>{
    this.setState({
       index : i
    })
  }
  render(){
    let {index} = this.state;
    let {className,tabs,children} = this.props;
    return (
      <div className={classNames("tab",className)}>
        <ul className="tab-list">
          {this.props.fixed}
          {tabs.map((v,i)=>{
            return  <li key={i} className={classNames("tab-list-item",index===i?"tab-list-item-active":"")} onClick={this.onClick.bind(this,i)}>{v}</li>
          })}
        </ul>
        <div className="tab-content">
          {
           children.map((v,i)=>{
             return <div key={i} className={classNames("tab-content-item",index===i?"tab-content-item-active":"")}>{v}</div>
           })
          }
        </div>
      </div>
    )
  }
}