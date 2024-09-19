import React, { Component } from 'react';
import Theme from '../Theme';

// Component imports
import './StatusBar.css';
import Channel from './Channel';
import ActionPicker from './ActionPicker';

// Props:
//  user {}
//  onLogoutClicked()
class StatusBar extends Component
{
    constructor(props)
    {
        super(props)

        this.actionPickerRef = React.createRef()
    }

    onUserClicked(channel)
    {
        this.actionPickerRef.current.open();
    }

    onAction(action)
    {
        switch (action)
        {
            case "logout": this.props.onLogoutClicked(); break;
            case "settings": this.props.onSettingsClicked(); break;
            default: break;
        }
    }

    render()
    {
        return (
            <div style={{backgroundColor:Theme.TabColor, height:"100%", padding:"0 16px"}}>
                <div style={{float:"right"}}>
                    <Channel channel={this.props.user} onSelected={this.onUserClicked.bind(this)} />
                    <div className="ActionPicker"><ActionPicker ref={this.actionPickerRef} actions={["settings", "logout"]} onAction={this.onAction.bind(this)} /></div>
                </div>
            </div>
        );
    }
}

export default StatusBar;
