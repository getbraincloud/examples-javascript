import React, { Component } from 'react';
import './CreateGroupScreen.css';
import Theme from '../../Theme';

// Component imports
import Channel from '../Channel';
import Search from '../Search';

// Props
//  bcWrapper
//  onDismiss()
//  onCreateGroup(name)
//  onGroupSelected(group)
class CreateGroupScreen extends Component
{
    constructor()
    {
        super();

        this.page = 1;
        this.totalCount = 0;
        this.fetchedCount = 0;

        this.state = {
            fetched: false,
            searchText: "",
            groups: []
        };
    }

    fetchGroups()
    {
        this.page = 1;
        this.totalCount = 0;
        this.fetchedCount = 0;

        this.fetchNext();
    }

    fetchNext()
    {
        console.log("BC listGroupsPage");
        this.props.bcWrapper.group.listGroupsPage({
                "pagination": {
                    "rowsPerPage": 50,
                    "pageNumber": this.page
                },
                "searchCriteria": {
                    "groupType": "bcchat"
                },
                "sortCriteria": {
                    "createdAt": 1,
                    "updatedAt": -1
                }
            }, result =>
        {
            console.log(JSON.stringify(result));
            if (result.status === 200)
            {
                this.totalCount = result.data.results.count;
                this.fetchedCount += result.data.results.items.length;
                result.data.results.items.forEach(group =>
                {
                    if (!this.state.groups.find(gr => gr.groupId === group.groupId))
                    {
                        console.log("BC getChannelId");
                        this.props.bcWrapper.chat.getChannelId("gr", group.groupId, result =>
                        {
                            console.log(JSON.stringify(result));
                            if (result.status === 200)
                            {
                                group.id = result.data.channelId;
                                let state = this.state;
                                state.groups.push(group);
                                this.setState(state);
                            }
                            else
                            {
                                this.props.onDismiss();
                            }
                        });
                    }
                });
                if (this.fetchedCount < this.totalCount)
                {
                    this.page++;
                    this.fetchNext();
                }
                else
                {
                    this.setState({fetched: true});
                }
            }
            else
            {
                this.props.onDismiss();
            }
        });
    }

    onClearSearch()
    {
        this.setState({searchText: ""});
    }

    onSearch(text, callback)
    {
        this.setState({searchText: text});
        callback();
    }

    onCreateClicked(name)
    {
        this.props.CreateGroupScreen(name);
        this.props.onDismiss();
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
        if (e.target === this.refs.CreateGroupScreen)
        {
            this.props.onDismiss();
        }
    }

    componentDidMount()
    {
        document.addEventListener('keydown', this.onKeyPress.bind(this));

        if (!this.state.fetched)
        {
            this.fetchGroups();
        }
    }

    handleSubmit(e)
    {
        if (this.state.searchText === '')
        {
            alert('Name is required');
        }
        else
        {
            this.props.onCreateGroup(this.state.searchText);
            this.props.onDismiss();
        }
        
        e.preventDefault();
    }

    onGroupSelected(group)
    {
        this.props.onGroupSelected(group);
        this.props.onDismiss();
    }
    
    render()
    {
        let searchString = this.state.searchText.toLowerCase();

        return (
            <div className="CreateGroupScreen" ref="CreateGroupScreen" onClick={this.onClickedOuside.bind(this)} >
                <div style={{...Theme.FormStyle, marginTop:"25vh"}}>
                    <h4 style={{...Theme.DefaultStyle, display:"block"}}>
                        Create private group named:
                    </h4>
                    <form onSubmit={this.handleSubmit.bind(this)}>
                        <Search ref="Search"
                            placeholder="Group Name"
                            onClearSearch={this.onClearSearch.bind(this)} 
                            onSearch={this.onSearch.bind(this)}
                            autofocus={true} />
                        {
                            this.state.fetched ?
                                (<input type="submit" value="Create"
                                    style={{...Theme.ButtonStyle, display:"block", margin:"16px 0px 16px auto"}} />) :
                                ""
                        }
                    </form>
                    <div ref="results" className="CreateGroupScreen-Results">
                        {
                            this.state.groups.filter(group => group.name.toLowerCase().includes(searchString)).map(group =>
                            {
                                return (
                                    <div key={group.groupId} style={{textAlign:"left"}}>
                                        <Channel channel={group} onSelected={this.onGroupSelected.bind(this)} />
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

export default CreateGroupScreen;
