import React, { Component } from 'react';
import Theme from '../Theme';

// Component imports
import PictureWord from './PictureWord';

// Props:
//  user {}
//  onLogoutClicked()
class StatusBar extends Component
{
    onLogoutClicked(e)
    {
        this.props.onLogoutClicked();
    }

    render()
    {
        return (
            <div style={{backgroundColor:Theme.TabColor, height:"100%", padding:"0 16px"}}>
                <button style={{float:"right", marginTop:"10px"}} onClick={this.onLogoutClicked.bind(this)}>Log Out</button>
                <div style={{float:"right"}}>
                    <PictureWord id={this.props.user.id} url={this.props.user.pic} text={this.props.user.name} />
                </div>
            </div>
        );
    }
}

export default StatusBar;
