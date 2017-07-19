/**
 * Created by liulingli on 2017/7/13.
 * desc 通用组件 - panel面板
 */
import React,{Component} from 'react';
import classNames from "classnames";

export default class Panel extends Component{
  constructor(props){
    super(props);
  }
  render(){
    let {className,title,children} = this.props;
    return (
      <div className={classNames("panel",className)}>
         <h2 className="panel-title">{title}</h2>
         <div className="panel-content">
           {children}
         </div>
      </div>
    )
  }
}