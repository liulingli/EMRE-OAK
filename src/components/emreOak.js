import React,{Component} from 'react'
import Ueditor from './ueditor';

export default class EmreOak extends Component {
  componentWillMount(){

  }
  render () {
    let {id,style} = this.props;
    return (
      <div className="emra-oak">
        <Ueditor id={id} style={style}/>
      </div>
    )
  }
}
