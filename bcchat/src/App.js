import React, { Component } from 'react';
import './App.css';
import Theme from './Theme';
import packageJson from '../package.json';
import BC from 'braincloud';

// Component imports
import AddFriendScreen from './components/screens/AddFriendScreen';
import ChatScreen from './components/screens/ChatScreen';
import CreateGroupScreen from './components/screens/CreateGroupScreen';
import EnterNameScreen from './components/screens/EnterNameScreen';
import LogInScreen from './components/screens/LogInScreen';
import ids from './ids'; // CREATE ids.js AND EXPORT appId, appSecret and url

let GAMES = {
    bcchat: {
        appId: ids.appId, 
        appSecret: ids.appSecret, 
        url: ids.url
    }
}

let MAX_HISTORY = 100;

let currentApp = GAMES.bcchat;
let defaultChannelsInitState = {
    names: [],
    connected: 0,
    failed: 0,
    channels: []
}

const AppState = {
    Loading: 0,
    LogIn: 1,
    EnterName: 2,
    Chat: 3,
    AddFriend: 4,
    CreateGroup: 5,
    InviteMember: 6
}

let pendingOutgoingMessages = [];

class App extends Component
{
    constructor()
    {
        super();

        this.bcWrapper = null;
        this.bcScriptLoadedCount = 0;
        this.pendingMsgs = [];
        this.feedUpdating = false;

        this.state = this.getDefaultState();
    }

    getDefaultState()
    {
        return {
            appState: AppState.Loading,
            loadingText: "Loading ...",
            chatData: {
                channels: [],
                friends: [],
                groups: [],
                mailboxes: [],
                activeChannel: null
            },
            user: {
                name: "",
                pic: "",
                id: ""
            }
        };
    }

    dieWithMessage(message)
    {
        // Close RTT connection
        this.bcWrapper.brainCloudClient.deregisterAllRTTCallbacks();
        this.bcWrapper.brainCloudClient.resetCommunication();

        // Pop alert message
        alert(message);

        // Go back to default loading state
        this.setState(this.getDefaultState());

        // Initialize BC libs and start over
        this.initBC();
        this.setState({appState: AppState.LogIn});
    }

    initBC()
    {
        this.bcWrapper = new BC.BrainCloudWrapper("bcchat");
        this.bcWrapper.initialize(currentApp.appId, currentApp.appSecret, packageJson.version);
        if (currentApp.url) this.bcWrapper.brainCloudClient.setServerUrl(currentApp.url);
        this.bcWrapper.brainCloudClient.enableLogging(true);
    }

    componentDidMount()
    {
        this.initBC();
        this.bcWrapper.restoreSession(result =>
        {
            if (result.status === 200)
            {
                this.handlePlayerState(result);
            }
            else
            {
                this.setState({appState: AppState.LogIn});
            }
        });
    }

    handlePlayerState(result)
    {
        console.log(JSON.stringify(result));
        if (result.status === 200)
        {
            let state = this.state;
            state.user.id = result.data.profileId;
            state.user.pic = result.data.pictureUrl;
            this.setState(state);

            // Set username if not
            if (!result.data.playerName)
            {
                this.askForName();
            }
            else
            {
                let state = this.state;
                state.user.name = result.data.playerName;
                this.setState(state);

                this.onLoggedIn();
            }
        }
        else
        {
            this.dieWithMessage("Login Failed: " + result.status_message);
        }
    }

    handleLogin(login)
    {
        currentApp = GAMES[login.appName];
        this.initBC();

        console.log("BC: authenticateUniversal");
        this.bcWrapper.authenticateUniversal(login.username, login.password, true, this.handlePlayerState.bind(this));

        let state = this.state;
        state.appState = AppState.Loading;
        state.loadingText = "Logging in ...";
        this.setState(state);
    }

    askForName()
    {
        let state = this.state;
        state.appState = AppState.EnterName;
        this.setState(state);
    }

    handleName(name)
    {
        let fullName = name.firstname + " " + name.lastname;

        console.log("BC: updateUserName");
        this.bcWrapper.playerState.updateUserName(fullName, result =>
        {
            console.log(JSON.stringify(result));
            if (result.status === 200)
            {
                this.onLoggedIn();
            }
            else
            {
                this.dieWithMessage("Failed to update username to brainCloud");
            }
        });

        let state = this.state;
        state.user.name = fullName;
        state.appState = AppState.Loading;
        state.loadingText = "Loading ...";
        this.setState(state);
    }

    onLoggedIn()
    {
        // Turn on RTT
        console.log("BC: enableRTT");
        this.bcWrapper.brainCloudClient.registerRTTChatCallback(this.onRttMessage.bind(this));
        this.bcWrapper.brainCloudClient.registerRTTPresenceCallback(this.onRttMessage.bind(this));
        this.bcWrapper.brainCloudClient.enableRTT(result =>
        {
            console.log(JSON.stringify(result));
            this.onRTTConnected();
        }, error => 
        {
            console.log(error);
            this.dieWithMessage("Disconnected from RTT: " + error);
        });
    }

    onRTTConnected()
    {
        // Connect to default channels
        this.connectToGlobalChannels();

        // Fetch friend list
        this.fetchFriendList();

        // Fetch mailboxes
        // this.fetchMailBoxes();

        // Fetch groups
        this.fetchGroups();

        // We go to chat view, channels/mailboxes/friends will just fill up with the magic of ReactJS
        this.setState({appState: AppState.Chat});
    }

    initFriend(friend)
    {
        friend.id = friend.playerId;
        friend.pic = friend.pictureUrl;
        friend.messages = [];
        friend.sendMsgHandler = this.sendDirectMessage.bind(this);
    }

    fetchFriendList()
    {
        console.log("BC ListFriends");
        this.bcWrapper.friend.listFriends(this.bcWrapper.friend.friendPlatform.All, false, result =>
        {
            console.log(JSON.stringify(result));
            if (result.status === 200)
            {
                let state = this.state;
                state.chatData.friends = result.data.friends;
                state.chatData.friends.forEach(friend =>
                {
                    this.initFriend(friend);
                });

                // Add ourselves to the friend list so we can chat to ourselves
                state.chatData.friends.splice(0, 0, state.user);

                this.setState(state);
            }
            else
            {
                this.dieWithMessage("Faile to retrieve friend list");
            }
        });
    }

    fetchMailBoxes()
    {
        console.log("BC getMessageboxes");
        this.bcWrapper.messaging.getMessageCounts(result =>
        {
            console.log(JSON.stringify(result));
            if (result.status === 200)
            {

            }
            else
            {
                this.dieWithMessage("Failed to retrieve messageboxes: " + result.status_message);
            }
        });
    }

    fetchGroups()
    {
        console.log("BC getMyGroups");
        this.bcWrapper.group.getMyGroups(result =>
        {
            console.log(JSON.stringify(result));
            if (result.status === 200)
            {
                result.data.groups.forEach(group => this.loadGroup(group));

                // Auto accept invites
                // ...
            }
            else
            {
                this.dieWithMessage("Failed to retrieve my groups: " + result.status_message);
            }
        });
    }

    loadGroup(group)
    {
        console.log("BC getChannelId");
        this.bcWrapper.chat.getChannelId("gr", group.groupId, result =>
        {
            console.log(JSON.stringify(result));
            if (result.status === 200)
            {
                group.id = result.data.channelId;
                this.connectToChannel(group, () =>
                {
                    let state = this.state;
                    state.chatData.groups.push(group);
                    this.setState(state);

                    this.bcWrapper.group.readGroupMembers(group.groupId, result =>
                    {
                        console.log(JSON.stringify(result));
                        if (result.status === 200)
                        {
                            let state = this.state;
                            group.members = [];
                            Object.keys(result.data).forEach(profileId =>
                            {
                                var member = result.data[profileId];
                                group.members.push({
                                    id: profileId,
                                    name: member.playerName,
                                    pic: null,
                                    online: state.user.id === profileId
                                });
                            });
                            this.setState(state);

                            this.bcWrapper.presence.registerListenersForGroup(group.groupId, true, result =>
                            {
                                console.log(JSON.stringify(result));
                                if (result.status === 200)
                                {
                                    let state = this.state;
                                    result.data.presence.forEach(presence =>
                                    {
                                        var member = group.members.find(member => presence.user.id === member.id);
                                        if (member)
                                        {
                                            member.pic = presence.user.pic;
                                            member.online = presence.online;
                                        }
                                    });
                                    this.setState(state);
                                }
                                else
                                {
                                    alert("Failed to register listeners for group: " + group.name + ", Err: " + result.status_message);
                                }
                            });
                        }
                        else
                        {
                            alert("Failed to read group members: " + group.name + ", Err: " + result.status_message);
                        }
                    });
                }, () => {
                    alert("Failed to connect to group: " + group.name);
                });
            }
            else
            {
                alert("Failed to connect to group: " + group.name + ", Err: " + result.status_message);
            }
        });
    }

    onAddFriendClicked()
    {
        let state = this.state;
        state.appState = AppState.AddFriend;
        this.setState(state);
    }

    onCreateGroupClicked()
    {
        let state = this.state;
        state.appState = AppState.CreateGroup;
        this.setState(state);
    }

    onInviteMemberToGroupClicked(group)
    {
        let state = this.state;
        state.appState = AppState.InviteMember;
        state.invitingGroup = group;
        this.setState(state);
    }

    removeMessage(message)
    {
        let channel = this.state.chatData.activeChannel;

        message.hideRemoveBtn = true;
        this.setState(this.state);

        console.log("BC deleteChatMessage");
        this.bcWrapper.chat.deleteChatMessage(channel.id, message.msgId, message.ver, result =>
        {
            console.log(JSON.stringify(result));
            if (result.status === 200)
            {
                let index = channel.messages.indexOf(message);
                if (index > -1)
                {
                    channel.messages.splice(index, 1);
                    this.setState(this.state);
                }
            }
            else
            {
                message.hideRemoveBtn = false;
            }
        });
    }

    updateMessage(message)
    {
        let channel = this.state.chatData.activeChannel;

        message.hideRemoveBtn = true;
        this.setState(this.state);

        console.log("BC updateChatMessage");
        this.bcWrapper.chat.updateChatMessage(channel.id, message.msgId, message.ver, message.content, result =>
        {
            console.log(JSON.stringify(result));
            message.hideRemoveBtn = false;
            if (result.status === 200)
            {
                // All good
            }
            else
            {
                alert("Failed to update message");
            }
        });

        this.setState(this.state);
    }

    joinGroup(group)
    {
        // Make sure we're not already part of it
        if (this.state.chatData.groups.find(gr => gr.groupId === group.groupId))
        {
            return;
        }

        console.log("BC joinGroup: " + JSON.stringify(group));
        this.bcWrapper.group.joinGroup(
            group.groupId,
            result =>
        {
            console.log(JSON.stringify(result));
            if (result.status === 200)
            {
                this.loadGroup(group);
            }
            else
            {
                // We don't kill the app for this
                alert("Failed to join group: " + result.status_message);
            }
        });
    }

    onCreateGroup(name)
    {
        // Make sure we're not already part of it
        if (this.state.chatData.groups.find(gr => gr.name.toLowerCase() === name.toLowerCase()))
        {
            return;
        }

        console.log("BC createGroup");
        this.bcWrapper.group.createGroup(
            name, // name
            "bcchat", // groupType
            true, // isOpenGroup
            null, // acl
            {}, // ownerAttributes
            {}, // defaultMemberAttributes
            {}, // data
            result =>
        {
            console.log(JSON.stringify(result));
            if (result.status === 200)
            {
                this.loadGroup(result.data);
            }
            else
            {
                // We don't kill the app for this
                alert("Failed to create group: " + result.status_message);
            }
        });
    }

    onAddFriendSelected(friend)
    {
        let state = this.state;
        if (!state.chatData.friends.find(frd => frd.id === friend.id))
        {
            friend.sendMsgHandler = this.sendDirectMessage;
            state.chatData.friends.push(friend);
            this.setState(state);

            this.bcWrapper.friend.addFriends([friend.id], result =>
            {
                console.log(JSON.stringify(result));
                if (result.status === 200)
                {
                }
                else
                {
                    // We don't kill the app for this
                    alert("Error adding friend");
                }
            });
        }
        else
        {
            // Already present, just do nothing...
        }
    }

    onAddFriendToGroup(friend)
    {
        // let state = this.state;
    }

    onDismissCommonDialogScreen()
    {
        let state = this.state;
        state.appState = AppState.Chat;
        this.setState(state);
    }

    connectToGlobalChannels()
    {
        this.bcWrapper.chat.getSubscribedChannels("gl", result =>
        {
            console.log(JSON.stringify(result));
            if (result.status === 200)
            {
                defaultChannelsInitState.connected = 0;
                defaultChannelsInitState.failed = 0;
                defaultChannelsInitState.channels = result.data.channels;
                defaultChannelsInitState.names = defaultChannelsInitState.channels.map(channel => channel.name);
                defaultChannelsInitState.channels.forEach(channel =>
                {
                    this.connectToChannel(channel, () =>
                    {
                        defaultChannelsInitState.connected++;
                        this.checkDefaultChannelsInitComplete();
                    }, () => {
                        defaultChannelsInitState.failed++;
                        this.checkDefaultChannelsInitComplete();
                    });
                });
            }
            else
            {
                this.dieWithMessage("Failed to get global channels");
            }
        });
    }

    checkDefaultChannelsInitComplete()
    {
        if (defaultChannelsInitState.failed + defaultChannelsInitState.connected === defaultChannelsInitState.names.length)
        {
            if (defaultChannelsInitState.failed > 0)
            {
                this.dieWithMessage("Failed to connect to default Channels");
            }
            else
            {
                let state = this.state;
                state.chatData.channels = defaultChannelsInitState.channels.sort((a, b) => a.name < b.name ? -1 : 1);
                state.chatData.activeChannel = null;
                if (state.chatData.channels.length > 0)
                {
                    state.chatData.activeChannel = state.chatData.channels[0];
                }
                this.setState(state);
            }
        }
    }

    connectToChannel(channel, onSuccess, onFail)
    {
        console.log("BC: channelConnect");
        this.bcWrapper.chat.channelConnect(channel.id, MAX_HISTORY, result =>
        {
            console.log(JSON.stringify(result));
            if (result.status === 200)
            {
                channel.messages = result.data.messages;
                channel.sendMsgHandler = this.sendChatChannelMsg.bind(this);
                onSuccess();
            }
            else
            {
                onFail();
            }
        });
    }

    onRemoveMessage(data)
    {
        let state = this.state;
        let pred = channel => channel.id === data.chId;
        let channel = state.chatData.channels.find(pred);
        if (!channel) channel = state.chatData.groups.find(pred);
        if (channel)
        {
            channel.messages = channel.messages.filter(message => message.msgId !== data.msgId);
            this.setState(state);
        }
    }

    onUpdateMessage(data)
    {
        let state = this.state;
        let pred = channel => channel.id === data.chId;
        let channel = state.chatData.channels.find(pred);
        if (!channel) channel = state.chatData.groups.find(pred);
        if (channel)
        {
            let message = channel.messages.find(message => message.msgId === data.msgId);
            if (message)
            {
                let index = channel.messages.indexOf(message)
                if (index > -1)
                {
                    channel.messages[index] = data;
                    this.setState(state);
                }
            }
        }
    }

    updateMessageFeed()
    {
        let state = this.state;

        this.pendingMsgs.forEach(message =>
        {
            let pred = channel => channel.id === message.chId;
            let channel = state.chatData.channels.find(pred);
            if (!channel) channel = state.chatData.groups.find(pred);
            if (channel)
            {
                if (state.chatData.activeChannel !== channel)
                {
                    channel.dirty = true;
                    this.updateAppTitleBasedOnChannelDirty();
                }

                channel.messages.push(message);
                while (channel.messages.length > MAX_HISTORY) {
                    channel.messages.shift();
                }
            }
        });

        this.pendingMsgs = [];
        this.feedUpdating = true;
        this.setState(state);

        setTimeout(() =>
        {
            this.feedUpdating = false;
            if (this.pendingMsgs.length > 0)
            {
                this.updateMessageFeed();
            }
        }, 500);
    }

    onChatMessage(message)
    {
        if (message.from.id === this.bcWrapper.brainCloudClient.getProfileId() && message.content.rich && message.content.rich.localTime)
        {
            message.content.rich.roundTrip = new Date().getTime() - message.content.rich.localTime;

            // eslint-disable-next-line
            let outgoingMessage = pendingOutgoingMessages.find(msg => msg.msgId == message.msgId);
            if (outgoingMessage && outgoingMessage.content.rich.apiRoundTrip)
            {
                message.content.rich.apiRoundTrip = outgoingMessage.content.rich.apiRoundTrip;
                pendingOutgoingMessages.splice(pendingOutgoingMessages.indexOf(outgoingMessage), 1);
            }
        }

        this.pendingMsgs.push(message);
        if (!this.feedUpdating)
        {
            this.updateMessageFeed();
        }
    }

    onRttMessage(message)
    {
        if (message.service === "chat" && message.operation === "INCOMING")
        {
            this.onChatMessage(message.data);
        }
        else if (message.service === "chat" && message.operation === "DELETE")
        {
            this.onRemoveMessage(message.data);
        }
        else if (message.service === "chat" && message.operation === "UPDATE")
        {
            this.onUpdateMessage(message.data);
        }
        else if (message.service === "presence" && message.operation === "INCOMING")
        {
            var from = message.data.from;
            let state = this.state;
            state.chatData.groups.forEach(group =>
            {
                if (group.members)
                {
                    group.members.forEach(member =>
                    {
                        if (member.id === from.id)
                        {
                            member.online = message.data.online;
                        }
                    });
                }
            });
            this.setState(state);
        }
    }

    fetchChannelMessages(channel)
    {
        console.log("BC: getChatMessages");
        this.bcWrapper.chat.getChatMessages(channel.id, 25, result =>
        {
            console.log(JSON.stringify(result));
            if (result.status === 200)
            {
                let state = this.state;
                channel.messages = result.data.messages;
                this.setState(state);
            }
            else
            {
                this.dieWithMessage("Failed to fetch channel's messages");
            }
        });
    }

    updateAppTitleBasedOnChannelDirty()
    {
        let dirtyPred = (count, item) =>
        {
            if (item.dirty) count++;
            return count;
        };

        let dirtyCount = this.state.chatData.channels.reduce(dirtyPred, 0);
        dirtyCount = this.state.chatData.friends.reduce(dirtyPred, dirtyCount);
        dirtyCount = this.state.chatData.groups.reduce(dirtyPred, dirtyCount);

        let title = "BC Chat";
        if (dirtyCount > 0) title = "(" + dirtyCount + ") " + title;

        document.title = title;
    }

    onChannelSelected(channel)
    {
        let state = this.state;
        state.chatData.activeChannel = channel;
        state.chatData.activeChannel.dirty = false;        
        this.setState(state);

        this.updateAppTitleBasedOnChannelDirty();

        // Fetch messages if not already did
        if (!channel.messages)
        {
            this.fetchChannelMessages(channel);
        }
    }

    onFriendSelected(friend)
    {
        let state = this.state;
        state.chatData.activeChannel = friend;
        state.chatData.activeChannel.dirty = false;        
        this.setState(state);

        this.updateAppTitleBasedOnChannelDirty();
/*
        // Fetch messages if not already did
        if (!channel.messages)
        {
            this.fetchChannelMessages(channel);
        }*/
    }

    onRemoveGroup(group)
    {
        let state = this.state;
        let i = state.chatData.groups.indexOf(group);
        if (i > -1)
        {
            state.chatData.groups.splice(i, 1);
            this.setState(state);
        }

        console.log("BC: leaveGroup");
        this.bcWrapper.group.leaveGroup(group.groupId, result =>
        {
            console.log(JSON.stringify(result));
            if (result.status === 200)
            {
                // ... yay
            }
            else
            {
                // Don't kill the app for that
                this.dieWithMessage("Failed to leave group");
            }
        });     
    }

    onRemoveFriend(friend)
    {
        if (friend.id === this.state.user.id)
        {
            // Can't remove self
            return;
        }

        let state = this.state;
        let i = state.chatData.friends.indexOf(friend);
        if (i > -1)
        {
            state.chatData.friends.splice(i, 1);
            this.setState(state);
        }

        console.log("BC: removeFriends");
        this.bcWrapper.friend.removeFriends([friend.id], result =>
        {
            console.log(JSON.stringify(result));
            if (result.status === 200)
            {
                // ... yay
            }
            else
            {
                // Don't kill the app for that
                this.dieWithMessage("Failed to remove friend");
            }
        });
    }

    sendChatChannelMsg(channel, message)
    {
        let content = {
            text: message,
            rich: {
                localTime: new Date().getTime()
            }
        };
        let recordInHistory = true;

        // Very hacky, but add a way to send "expression" that dont keep in history
        if (message.substr(0, 1) === "/")
        {
            if (message.substr(1, 2).toLowerCase() === "me")
            {
                content.text = "_[no history] " + message.substr(3) + "_";
                recordInHistory = false;
            }
        }

        let outgoingMessage = {
            channelId: this.state.chatData.activeChannel.id,
            content: content
        };
        pendingOutgoingMessages.push(outgoingMessage);

        console.log("BC: postChatMessage");
        this.bcWrapper.chat.postChatMessage(this.state.chatData.activeChannel.id, content, recordInHistory, result =>
        {
            console.log(JSON.stringify(result));
            if (result.status === 200)
            {
                outgoingMessage.msgId = result.data.msgId;
                outgoingMessage.content.rich.apiRoundTrip = new Date().getTime() - outgoingMessage.content.rich.localTime;

                // If the message was already received by RTT, update it.
                let state = this.state;
                let pred = channel => channel.id === outgoingMessage.channelId;
                let channel = state.chatData.channels.find(pred);
                if (!channel) channel = state.chatData.groups.find(pred);
                if (channel)
                {
                    // eslint-disable-next-line
                    let message = channel.messages.find(message => message.msgId == outgoingMessage.msgId);
                    if (message)
                    {
                        message.content.rich.apiRoundTrip = outgoingMessage.content.rich.apiRoundTrip;
                        pendingOutgoingMessages.splice(pendingOutgoingMessages.indexOf(outgoingMessage), 1);
                        this.setState(state);
                    }
                }
            }
            else
            {
                this.dieWithMessage("Failed to send message");
            }
        });
        this.bcWrapper.brainCloudClient.insertEndOfMessageBundleMarker();
    }

    sendDirectMessage(friend, message)
    {
        this.bcWrapper.messaging.sendSimpleMessage([friend.id], message, result =>
        {
            console.log(JSON.stringify(result));
            if (result.status === 200)
            {
            }
            else
            {
                this.dieWithMessage("Failed to send message");
            }
        });
    }

    onTextEntered(message)
    {
        if (this.state.chatData.activeChannel && this.state.chatData.activeChannel.sendMsgHandler)
        {
            this.state.chatData.activeChannel.sendMsgHandler(this.state.chatData.activeChannel, message);
        }
    }

    onIdleTest()
    {
        console.log("BC runScript(\"IdleSleep\")");
        this.bcWrapper.script.runScript("IdleSleep", {}, result =>
        {
            console.log(JSON.stringify(result));
        });
    }

    logout()
    {
        this.setState({
            appState: AppState.Loading,
            loadingText: "Loging out ..."});

        this.bcWrapper.brainCloudClient.playerState.logout(result =>
        {
            this.setState(this.getDefaultState());
            this.setState({appState: AppState.LogIn});
        });
    }

    renderChatScreen()
    {
        return <ChatScreen user={this.state.user}
                           data={this.state.chatData} 
                           onChannelSelected={this.onChannelSelected.bind(this)}
                           onFriendSelected={this.onFriendSelected.bind(this)}
                           onTextEntered={this.onTextEntered.bind(this)}
                           onAddFriendClicked={this.onAddFriendClicked.bind(this)}
                           onCreateGroupClicked={this.onCreateGroupClicked.bind(this)}
                           onRemoveGroup={this.onRemoveGroup.bind(this)}
                           onRemoveFriend={this.onRemoveFriend.bind(this)}
                           onInviteMemberToGroupClicked={this.onInviteMemberToGroupClicked.bind(this)}
                           onRemoveMessage={this.removeMessage.bind(this)}
                           onUpdateMessage={this.updateMessage.bind(this)}
                           onLogoutClicked={this.logout.bind(this)} />
    }

    render()
    {
        switch (this.state.appState)
        {
            case AppState.Loading:
            {
                return (
                    <div className="App">
                        <div style={{...Theme.FormStyle, marginTop:"25vh"}}>
                            <h1 style={Theme.DefaultStyle}>{this.state.loadingText}</h1>
                        </div>
                    </div>
                );
            }
            case AppState.LogIn:
            {
                let versionSuffix = currentApp.url ? " - dev" : " - prod"
                return (
                    <div className="App">
                        <LogInScreen onLogin={this.handleLogin.bind(this)} games={Object.keys(GAMES)} />
                        <div style={{color:Theme.DarkTextColor, marginTop:"16px"}}>
                            {`version: ${packageJson.version}${versionSuffix}`}
                        </div>
                    </div>
                );
            }
            case AppState.EnterName:
            {
                return (
                    <div className="App">
                        <EnterNameScreen onSubmitName={this.handleName.bind(this)} />
                    </div>
                );
            }
            case AppState.Chat:
            {
                return (
                    <div className="App" style={{height:"100vh"}}>
                        {/* <button onClick={this.onIdleTest.bind(this)}>IDLE TEST</button> */}
                        {this.renderChatScreen()}
                    </div>
                );
            }
            case AppState.AddFriend:
            {
                return (
                    <div className="App" style={{height:"100vh"}}>
                        {this.renderChatScreen()}
                        <AddFriendScreen bcWrapper={this.bcWrapper} 
                                         onDismiss={this.onDismissCommonDialogScreen.bind(this)}
                                         onFriendSelected={this.onAddFriendSelected.bind(this)} />
                    </div>
                );
            }
            case AppState.CreateGroup:
            {
                return (
                    <div className="App" style={{height:"100vh"}}>
                        {this.renderChatScreen()}
                        <CreateGroupScreen bcWrapper={this.bcWrapper} 
                                           onDismiss={this.onDismissCommonDialogScreen.bind(this)}
                                           onCreateGroup={this.onCreateGroup.bind(this)}
                                           onGroupSelected={this.joinGroup.bind(this)} />
                    </div>
                );
            }
            case AppState.InviteMember:
            {
                return (
                    <div className="App" style={{height:"100vh"}}>
                        {this.renderChatScreen()}
                        <AddFriendScreen bcWrapper={this.bcWrapper} 
                                         onDismiss={this.onDismissCommonDialogScreen.bind(this)}
                                         onFriendSelected={this.onAddFriendToGroup.bind(this)} />
                    </div>
                );
            }
            default:
            {
                return (
                    <div className="App" style={Theme.DefaultStyle}>
                        Wrong state
                    </div>
                );
            }
        }
    }
}

export default App;
