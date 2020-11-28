import React from 'react';
import {Card} from '@material-ui/core';
import '../App.css';

class IconCard extends React.Component {
    render(){
        return(
            <Card style={{padding:10}}>
                <h3>{this.props.item.name}</h3>
                <strong style={{marginLeft:10,fontSize:"20px"}}>{this.props.item.count}</strong>
                <i style={{color: 'blue',float:"right"}}  class="material-icons md-48 md-light">{this.props.item.icon}</i>
            </Card>
        )
    }
}

export default IconCard;