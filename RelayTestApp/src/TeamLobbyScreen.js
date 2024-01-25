import React, { Component } from 'react'

import { getShowJoinButton } from './App'

let colors = require('./Colors').colors

// Props:
// user
// lobby
class TeamLobbyScreen extends Component {
    onBack() {
        this.props.onBack()
    }

    onStart() {
        this.props.onStart()
    }

    onJoin() {
        this.props.onJoin()
    }

    onColorSelected(index) {
        this.props.user.colorIndex = index
        let me = this.props.lobby.members.find(member => member.cxId === this.props.user.cxId)
        if (me) {
            me.extra.colorIndex = index
        }
        localStorage.setItem("color", "" + index)
        this.props.onColorChanged(index)
    }

    onTeamChanged(){
        console.log("change team buttin clicked")
        // TODO:
        /**
         * Update team property to newTeam
         * Update colorIndex
         */
        if(this.props.user.team === "alpha"){
            console.log("team alpha, switch to beta")
            this.props.onTeamChanged("beta")
        }
        else if(this.props.user.team === "beta"){
            console.log("team beta, switch to alpha")
            this.props.onTeamChanged("alpha")
        }
        else{
            console.log("team uh oh")
        }
    }

    // TODO
    render() {
        return (
            <div className="TeamLobbyScreen">

                <div style={{ display: "flex" }}>
                    {/**Team Area: Alpha Team, Change Team Button, Beta Team */}
                    <div>
                        <p>Alpha Team</p>
                        <ul>
                            {
                                this.props.lobby.members.map(member => (
                                    member.team === "alpha" ? member.cxId === this.props.lobby.ownerCxId ? <li key={member.cxId} style={{ color: colors[4] }}>{member.name + " (host)"}</li> : <li key={member.cxId} style={{ color: colors[4] }}>{member.name}</li> : ""
                                ))
                            }
                        </ul>
                    </div>

                    <button className="Button" onClick={this.onTeamChanged.bind(this)} style={{alignSelf:"center"}}>Change Team</button>

                    <div>
                        <p>Beta Team</p>
                        <ul>
                            {
                                this.props.lobby.members.map(member => (
                                    member.team === "beta" ? member.cxId === this.props.lobby.ownerCxId ? <li key={member.cxId} style={{ color: colors[3] }}>{member.name + " (host)"}</li> : <li key={member.cxId} style={{ color: colors[3] }}>{member.name}</li> : ""
                                ))
                            }
                        </ul>
                    </div>
                </div>

                <div>
                    {/**Start Match / Join Match, Leave Lobby */}
                    {
                        this.props.lobby.ownerCxId === this.props.user.cxId && !this.props.user.isReady ? <button className="Button" onClick={this.onStart.bind(this)}>Start</button> : ""
                    }

                    {
                        getShowJoinButton() ? <button className="Button" onClick={this.onJoin.bind(this)}>Join Match</button> : ""
                    }

                    <button className="Button" onClick={this.onBack.bind(this)}>Leave</button>
                </div>

                <div>
                    {/**LobbyId */}
                    <p>Lobby ID: {this.props.lobby.lobbyId}</p>
                </div>
            </div>
        )
    }
}

export default TeamLobbyScreen;
