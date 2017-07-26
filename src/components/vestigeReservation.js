/**
 * Created by liulingli on 2017/7/10.
 * desc 电子病历编辑器 - 痕迹保留
 */
import React,{Component} from 'react';
import classNames from 'classnames';

export default class VestigeReservation extends Component {
  componentWillMount(){
     this.state = {
       marks : this.props.marks,
       isShow : this.props.isShow
     }
  }
  componentWillReceiveProps(nextProps,nextState){
     if(nextProps.marks !== nextState.marks){
       this.setState({
         marks : nextProps.marks,
         isShow : nextProps.isShow
       })
     }
  }

  render(){
    let {marks,isShow} = this.state;
    return (
      <div className="vestige-reservation">
         <ul className="vestige-list">
           {
             marks.map((v,i)=>{
             return(
               <li key={i} className="list">
                 <p>{v.author} {v.date}</p>
                 <p>{v.type}</p>
                 <p>{v.desc}</p>
               </li>
               )
             })
           }
         </ul>
      </div>
    )
  }
}