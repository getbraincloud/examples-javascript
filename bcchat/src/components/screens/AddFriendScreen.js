import React, { Component } from 'react';
import './AddFriendScreen.css';
import Theme from '../../Theme';

// Component imports
import Channel from '../Channel';
import Search from '../Search';

// Props
//  bcWrapper
//  onDismiss()
//  onFriendSelected(friend)
class AddFriendScreen extends Component
{
    constructor()
    {
        super();

        this.state = {
            searchResults: []
        };
    }

    onFriendSelected(friend)
    {
        this.props.onFriendSelected(friend);
        this.props.onDismiss();
    }

    onClearSearch()
    {
        this.setState({searchResults: []});
    }

    onSearch(text, callback)
    {
        console.log("findUsersBySubstrName: " + text);
        this.props.bcWrapper.friend.findUsersBySubstrName(text, 5, result =>
        {
            console.log(JSON.stringify(result));

            if (result.status === 200)
            {
                this.setState({searchResults: result.data.matches.map(friend =>
                {
                    friend.id = friend.profileId;
                    friend.pic = friend.pictureUrl;
                    friend.name = friend.profileName;
                    return friend;
                })});
            }
            
            callback();
        });
    }

    onKeyPress(e)
    {
        if (e.key === "Escape")
        {
            this.props.onDismiss();
        }
    }

    onClickedOuside(e)
    {
        if (e.target === this.refs.AddFriendScreen)
        {
            this.props.onDismiss();
        }
    }

    componentDidMount()
    {
        document.addEventListener('keydown', this.onKeyPress.bind(this));
    }

    render()
    {
        return (
            <div className="AddFriendScreen" ref="AddFriendScreen" onClick={this.onClickedOuside.bind(this)} >
                <div style={{...Theme.FormStyle, marginTop:"25vh"}}>
                    <h4 style={{...Theme.DefaultStyle, display:"block"}}>
                        Search users
                    </h4>
                    <Search ref="Search"
                        placeholder="Enter name"
                        minCharCount="3"
                        onClearSearch={this.onClearSearch.bind(this)} 
                        onSearch={this.onSearch.bind(this)}
                        autofocus={true} />
                    <div ref="results" className="AddFriendScreen-Results">
                        {
                            this.state.searchResults.map(friend =>
                            {
                                return (
                                    <div key={friend.id} style={{textAlign:"left"}}>
                                        <Channel channel={friend} onSelected={this.onFriendSelected.bind(this)} />
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default AddFriendScreen;
