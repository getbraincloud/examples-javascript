import React, { Component } from 'react';
import Theme from '../Theme';

let channelIcons = [
    "channelIcons/channelIcon1.png",
    "channelIcons/channelIcon2.png",
    "channelIcons/channelIcon3.png",
    "channelIcons/channelIcon4.png",
    "channelIcons/channelIcon5.png"
];

function hashCode(str) {
    var hash = 0, i, chr;
    if (str.length === 0) return hash;
    for (i = 0; i < str.length; i++) {
        chr   = str.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

function getPregenIcon(channelId)
{
    let iconIndex = Math.abs(hashCode(channelId)) % 5;
    return channelIcons[iconIndex];
}

// Props:
//  id
//  text
//  url
class PictureWord extends Component
{
    render()
    {
        return (
            <div style={{display: "inline-block", margin:"8px"}}>
                <img className="Avatar" src={this.props.url ? this.props.url : getPregenIcon(this.props.id ? this.props.id : this.props.text)} 
                     alt="" height="40" width="40" align="middle" 
                     style={{
                        display: "inline-block",
                        float:"left",
                        MozUserSelect:"none",
                        WebkitUserSelect:"none",
                        msUserSelect:"none"
                    }} />
                <div style={{
                        ...Theme.DefaultStyle,
                        color:Theme.DarkTextColor,
                        paddingTop:"12px",
                        paddingLeft:"8px",
                        whiteSpace:"nowrap",
                        overflow:"hidden",
                        textOverflow:"ellipsis"
                    }}>
                    {this.props.text}
                </div>
            </div>
        );
    }
}

export default PictureWord;
