import React, { Component } from 'react';
import './ChannelTab.css';

// Component imports
import AddButton from './AddButton';

// Props:
//  text
//  onAdd()
class ChannelTab extends Component
{
    onAdd(e)
    {
        this.props.onAdd();
    }

    render()
    {
        return (
            <div className="ChannelTab">
                <div className="ChannelTab-Title">
                    {this.props.text}
                </div>
                {this.props.onAdd ? (<AddButton onClicked={this.onAdd.bind(this)} />) : ""}
            </div>
        );
    }
}

export default ChannelTab;
