import React, { Component } from 'react';
import Theme from '../../Theme';

// Component imports
import Channels from '../Channels';
import MsgFeed from '../MsgFeed';
import StatusBar from '../StatusBar';
import MultilineTextInput from '../MultilineTextInput';
import PresenceTab from '../PresenceTab';

// Props
//  user {id, name, pic}
//  data
//  onChannelSelected(channel {})
//  onFriendSelected(channel {})
//  onTextEntered("")
//  onAddFriendClicked()
//  onCreateGroupClicked()
//  onRemoveGroup(group {})
//  onRemoveFriend(friend {})
//  onRemoveMessage(message)
//  onUpdateMessage(message)
//  onLogoutClicked()
class ChatScreen extends Component
{
    constructor()
    {
        super();
        this.state = {
        };
    }

    onChannelSelected(channel)
    {
        this.props.onChannelSelected(channel);
    }

    onFriendSelected(channel)
    {
        this.props.onFriendSelected(channel);
    }

    onRemoveGroup(group)
    {
        this.props.onRemoveGroup(group);
    }

    onRemoveFriend(group)
    {
        this.props.onRemoveFriend(group);
    }

    onTextEntered(message)
    {
        this.props.onTextEntered(message);
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

    onRemoveMessage(message)
    {
        this.props.onRemoveMessage(message);
    }

    onUpdateMessage(message)
    {
        this.props.onUpdateMessage(message);
    }

    onLogoutClicked()
    {
        this.props.onLogoutClicked();
    }

    render()
    {
        return (
            <div style={{height:"100%", textAlign:"left"}}>
                <div style={{float:"left", width:"300px", height:"100%"}}>
                    <Channels channels={this.props.data.channels} 
                              friends={this.props.data.friends}
                              groups={this.props.data.groups}
                              activeChannelId={this.props.data.activeChannel ? this.props.data.activeChannel.id : ""}
                              onSelected={this.onChannelSelected.bind(this)}
                              onFriendSelected={this.onFriendSelected.bind(this)}
                              onAddFriendClicked={this.onAddFriendClicked.bind(this)} 
                              onCreateGroupClicked={this.onCreateGroupClicked.bind(this)} 
                              onRemoveGroup={this.onRemoveGroup.bind(this)} 
                              onRemoveFriend={this.onRemoveFriend.bind(this)} 
                              onInviteMemberToGroupClicked={this.onInviteMemberToGroupClicked.bind(this)} />
                </div>
                <div style={{backgroundColor:Theme.MainBGColor, marginLeft:"300px", height:"100%"}}>
                    <div style={{height:"56px"}}>
                        <StatusBar user={this.props.user}
                                   onLogoutClicked={this.onLogoutClicked.bind(this)} />
                    </div>
                    <div style={{height:"calc(100% - 106px)"}}>
                        {
                            (this.props.data.activeChannel && this.props.data.activeChannel.members) ? (
                                <PresenceTab members={this.props.data.activeChannel.members} />
                            ) : ("")
                        }
                        <MsgFeed messages={(this.props.data.activeChannel && this.props.data.activeChannel.messages) ? this.props.data.activeChannel.messages : []}
                            userId={this.props.user.id}
                            onRemoveMessage={this.onRemoveMessage.bind(this)}
                            onUpdateMessage={this.onUpdateMessage.bind(this)} />
                    </div>
                    <div style={{height:"49px"}}>
                        <MultilineTextInput onTextEntered={this.onTextEntered.bind(this)} />
                    </div>
                </div>
            </div>
        );
    }
}

export default ChatScreen;
