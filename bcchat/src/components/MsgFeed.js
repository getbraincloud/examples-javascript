import React, { Component } from 'react';
import './MsgFeed.css';
import Theme from '../Theme';

// Component imports
import ChatMsg from './ChatMsg';
import MultilineTextInput from './MultilineTextInput';

// props:
//  messages []
//  userId
//  onRemoveMessage(message)
//  onUpdateMessage(message)
class MsgFeed extends Component
{
    constructor()
    {
        super();

        this.observer = null;
        this.isAtBottom = true;
        this.messageTextBeforeEditing = "";

        this.state = {
            editingMessage: null
        };
    }

    componentWillUpdate()
    {
        if (this.refs.Parent)
        {
            this.isAtBottom = this.refs.Parent.scrollTop >= (this.refs.Parent.scrollHeight - this.refs.Parent.clientHeight) - 200;
        }
        else
        {
            this.isAtBottom = false;
        }
    }

    componentDidUpdate()
    {
        if (!this.observer)
        {
            // Create an observer and pass it a callback.
            this.observer = new MutationObserver(this.scrollToBottom.bind(this));

            // Tell it to look for new children that will change the height.
            var config = {childList: true};
            this.observer.observe(this.refs.Content, config);
        }

        // Are we editing?
        if (this.state.editingMessage)
        {
            this.refs[this.state.editingMessage.msgId].scrollIntoView(false, {behavior: "smooth"});
        }
    }
    
    scrollToBottom()
    {
        if (this.isAtBottom)
        {
            this.refs.Parent.scrollTop = this.refs.Parent.scrollHeight;
        }
    }

    onMessageAction(action, msgId)
    {
        let message = this.props.messages.find(message => message.msgId === msgId);

        if (action === "delete")
        {
            this.props.onRemoveMessage(message);
        }
        else if (action === "edit")
        {
            this.startEditing(message);
        }
    }

    startEditing(message)
    {
        this.messageTextBeforeEditing = message.content.text;
        this.setState({editingMessage: message});
        document.addEventListener('keydown', this.onEditKeyPress.bind(this));
    }

    stopEditing()
    {
        document.removeEventListener('keydown', this.onEditKeyPress.bind(this));
        this.setState({editingMessage: null});
    }

    componentDidMount()
    {
        this.isAtBottom = true;
        this.scrollToBottom();
    }

    onTextEntered(message)
    {
        let state = this.state;
        if (this.messageTextBeforeEditing !== message &&
            this.messageTextBeforeEditing.trim() !== "")
        {
            state.editingMessage.content.text = message;
            this.props.onUpdateMessage(state.editingMessage);
        }
        this.setState(state);
        this.stopEditing();
    }

    onEditClickedOuside()
    {
        this.stopEditing();
    }

    onEditKeyPress(e)
    {
        if (e.key === "Escape")
        {
            this.stopEditing();
        }
    }

    render()
    {
        let messageGroups = this.props.messages.reduce((groups, message) =>
        {
            if (groups.length > 0)
            {
                let fistMessage = groups[groups.length - 1][0];
                if (fistMessage.from.id === message.from.id && // Same user
                    fistMessage.date >= message.date - 300000)   // ~5mins window
                {
                    groups[groups.length - 1].push(message);
                    return groups;
                }
            }
            groups.push([message]);
            return groups;
        }, []);

        return (
            <div className="MsgFeed-Parent" ref="Parent" style={{...Theme.DefaultStyle}}>
                <div className="MsgFeed-Content" ref="Content">
                    {
                        messageGroups.map(messageGroup => {
                            let firstMessage = messageGroup[0];
                            return messageGroup.map(message =>
                            {
                                let roundTrip = (message.content.rich) ? message.content.rich.roundTrip : null;
                                let apiRoundTrip = (message.content.rich) ? message.content.rich.apiRoundTrip : null;
                                let showActionButton = firstMessage.from.id === this.props.userId && !message.hideRemoveBtn;
                                let isFirstMessage = message === firstMessage;

                                return (
                                    <div key={message.msgId} ref={message.msgId}>
                                        <ChatMsg 
                                                msgId={message.msgId} 
                                                user={isFirstMessage ? firstMessage.from : null}
                                                message={message.content.text}
                                                date={isFirstMessage ? message.date : null}
                                                roundTrip={roundTrip}
                                                apiRoundTrip={apiRoundTrip}
                                                actions={showActionButton ? ["edit", "delete"] : null}
                                                onAction={showActionButton ? this.onMessageAction.bind(this) : null} />
                                        {
                                            (message === this.state.editingMessage) ? (
                                                <div>
                                                    <div className="EditMsg-ScreenBlocker" onClick={this.onEditClickedOuside.bind(this)} />
                                                    <div className="EditMsg-TextArea">
                                                        <MultilineTextInput placeholder="Enter message" onTextEntered={this.onTextEntered.bind(this)} defaultText={this.state.editingMessage.content.text} />
                                                    </div>
                                                </div>) :
                                                ""
                                        }
                                    </div>
                                );
                            })
                        })
                    }
                </div>
            </div>
        );
    }
}

export default MsgFeed;
