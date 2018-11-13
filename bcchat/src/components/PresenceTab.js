import React, { Component } from 'react';
import './PresenceTab.css';
import Theme from '../Theme';

// Component imports
import Channel from './Channel';

// Props:
//  members [{id, name, pic, online}, ...]
class PresenceTab extends Component
{
    render()
    {
        var orderedByOnline = this.props.members;
        orderedByOnline.sort((a, b) => {return (a.dirty?1:0)-(b.dirty?1:0)});

        return (
            <div className="PresenceTab" style={{backgroundColor:Theme.SecondaryBGColor}}>
                {
                    orderedByOnline.map(member => 
                    {
                        return (
                            <Channel key={member.id} channel={{id:member.id,name:member.name,pic:member.pic,dirty:member.online}} dirtyClassName="OnlineDot" />
                        );
                    })
                }
            </div>
        );
    }
}

export default PresenceTab;
