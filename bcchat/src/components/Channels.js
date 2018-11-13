import React, { Component } from 'react';
import Theme from '../Theme';

// Component imports
import Channel from './Channel';
import ChannelTab from './ChannelTab';

// Props:
//  channels [...]
//  groups [...]
//  friends [{id, name, pic}, ...]
//  activeChannelId bool
//  onSelected(channel {})
//  onFriendSelected(channel {})
//  onAddFriendClicked()
//  onCreateGroupClicked()
//  onRemoveGroup(group {})
//  onRemoveFriend(friend {})
class Channels extends Component
{
    onSelected(channel)
    {
        this.props.onSelected(channel);
    }

    onRemoveGroup(group)
    {
        this.props.onRemoveGroup(group);
    }

    onRemoveFriend(friend)
    {
        this.props.onRemoveFriend(friend);
    }

    onFriendSelected(friend)
    {
        this.props.onFriendSelected(friend);
    }

    onAddFriendClicked()
    {
        this.props.onAddFriendClicked();
    }

    onCreateGroupClicked()
    {
        this.props.onCreateGroupClicked();
    }

    onInviteMemberToGroupClicked(group)
    {
        this.props.onInviteMemberToGroupClicked(group);
    }

    render()
    {
        return (
            <div style={{backgroundColor:Theme.SecondaryBGColor, width:"100%", height:"100%", overflowY:"scroll"}}>
                <ChannelTab text="Global Channels" />
                <div>
                    {
                        this.props.channels.map(channel => 
                        {
                            return (
                                <Channel key={channel.id} channel={channel} selected={this.props.activeChannelId === channel.id} 
                                         onSelected={this.onSelected.bind(this)} />
                            );
                        })
                    }
                </div>
                <ChannelTab text="Private Groups" onAdd={this.onCreateGroupClicked.bind(this)} />
                <div>
                    {
                        this.props.groups.map(group => 
                        {
                            return (
                                <Channel key={group.id} channel={group} selected={this.props.activeChannelId === group.id} 
                                        onSelected={this.onSelected.bind(this)}
                                        onAdd={this.onRemoveGroup.bind(this)} 
                                        addText="-"/>
                            );
                        })
                    }
                </div>
                {/* <ChannelTab text="Mailboxes" /> // We will support those later
                <div>
                    {
                        this.props.channels.map(channel => 
                        {
                            return (
                                <Channel key={channel.id} channel={channel} selected={this.props.activeChannelId === channel.id} 
                                         onSelected={this.onSelected.bind(this)} />
                            );
                        })
                    }
                </div>
                <ChannelTab text="Direct Messages" onAdd={this.onAddFriendClicked.bind(this)} />
                <div>
                    {
                        this.props.friends.map(friend => 
                        {
                            return (
                                <Channel key={friend.id} channel={friend} selected={this.props.activeChannelId === friend.id} 
                                         onSelected={this.onFriendSelected.bind(this)}
                                         onAdd={this.onRemoveFriend.bind(this)} 
                                         addText="-" />
                            );
                        })
                    }
                </div> */}
            </div>
        );
    }
}

export default Channels;
