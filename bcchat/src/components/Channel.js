import React, { Component } from 'react';
import './Channel.css';

// Import components
import AddButton from './AddButton';
import PictureWord from './PictureWord'

// Props:
//  channel {id, name, pic, dirty}
//  dirtyClassName (To specify the style of the dirty icon)
//  selected
//  onSelected(channel {})
//  onAdd()
//  addText "+"
class Channel extends Component
{
    onSelected(e)
    {
        if (this.props.onSelected) this.props.onSelected(this.props.channel);
    }

    onAdd(e)
    {
        if (this.props.onAdd) this.props.onAdd(this.props.channel);
    }

    render()
    {
        return (
            <div className={this.props.selected ? "Channel-selected" : "Channel"} 
                 style={{padding:"0 16px"}} onMouseDown={this.onSelected.bind(this)}>
                {
                    this.props.channel.dirty ? (<div className={this.props.dirtyClassName ? ("DirtyDot " + this.props.dirtyClassName) : "DirtyDot"} />) : (<div />)
                }
                <PictureWord id={this.props.channel.id} text={this.props.channel.name} url={this.props.channel.pic} />
                {this.props.onAdd ? (<div className="Channel-selected-AddButton"><AddButton onClicked={this.onAdd.bind(this)} addText={this.props.addText} /></div>) : ""}
            </div>
        );
    }
}

export default Channel;
