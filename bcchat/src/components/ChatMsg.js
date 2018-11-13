import React, { Component } from 'react';
import './ChatMsg.css';
import Theme from '../Theme';

// Component imports
import ActionPicker from './ActionPicker';
import AddButton from './AddButton';
import PictureWord from './PictureWord';

var remark = require('remark'),
    reactRenderer = require('remark-react');

// Props:
//  user {url, name, id}
//  msgId
//  message ""
//  date
//  roundTrip
//  apiRoundTrip
//  onRemove()
//  onEdit()
//  actions []
//  onAction()
class ChatMsg extends Component
{
    showActionPicker()
    {
        this.refs.actionPicker.open();
    }

    onAction(action)
    {
        this.props.onAction(action, this.props.msgId);
    }

    render()
    {
        let time = null;
        if (this.props.date)
        {
            let utcMilliseconds = this.props.date;
            time = new Date(0);
            time.setUTCMilliseconds(utcMilliseconds);
        }

        return (
            <div className="ChatMsg">
                <div className="ActionPicker"><ActionPicker ref="actionPicker" actions={this.props.actions} onAction={this.onAction.bind(this)} /></div>
                {this.props.user ? (<PictureWord id={this.props.user.id} url={this.props.user.pic} text={this.props.user.name} />) : ""}
                {this.props.onAction ? (<div className="ChatMsg-RemoveButton"><AddButton onClicked={this.showActionPicker.bind(this)} addText="..." /></div>) : ""}
                <small className="ChatMsg-Timestamp" style={{color:Theme.DarkTextColor}}>
                    {((this.props.roundTrip && this.props.apiRoundTrip) ? ("(API:" + this.props.apiRoundTrip + "ms, T:" + this.props.roundTrip + "ms)" + (time ? (" " + time.toString()) : "")) : (time ? (" " + time.toString()) : ""))}
                </small>
                <div className="ChatMsg-Markdown" style={{...Theme.DefaultStyle}}>
                    {remark().use(reactRenderer).processSync(this.props.message).contents}
                </div>
            </div>
        );
    }
}

export default ChatMsg;
