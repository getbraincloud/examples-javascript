import React, { Component } from 'react'

import { getShowJoinButton } from './App'

let colors = require('./Colors').colors

// Props:
// user
// lobby
class LobbyScreen extends Component {
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

    onTeamSelected(teamName){
        console.log("User trying to join team " + teamName)
        this.props.onTeamChanged(teamName)
    }

    render() {
        return (
            <div className="LobbyScreen">
                <div>
                    {
                        /** If there are no teams, users can select their own colour. Otherwise, colour will initially be assigned automatically by team. */
                        this.props.teams.length === 1 ?
                            colors.map((color, i) => (<div key={color} className="colorBtn" style={{ backgroundColor: color, display: "inline-block", width: "50px", height: "40px" }} onClick={this.onColorSelected.bind(this, i)}>{i}</div>)) :
                            ""
                    }
                </div>
                <div style={{display: "flex", justifyContent:"space-between"}}>
                    {
                        this.props.teams.map((team, index) => (
                            <div key={team.name}>
                                {
                                    this.props.teams.length > 1 ? <button key={index} className="teamBtn" onClick={this.onTeamSelected.bind(this, team.name)}>Join Team {team.name}</button> : ""
                                }
                                <ul>
                                    {
                                        team.members.map(member => (
                                            member.cxId === this.props.lobby.ownerCxId ? <li key={member.cxId} style={{ color: colors[member.extra.colorIndex] }}>{member.name + " (host)"}</li> : <li key={member.cxId} style={{ color: colors[member.extra.colorIndex] }}>{member.name}</li>
                                        ))
                                    }
                                </ul>
                            </div>
                        ))
                    }
                </div>        
                <div style={{ display: "flex", justifyContent: "center" }}>
                    {
                        this.props.lobby.ownerCxId === this.props.user.cxId && !this.props.user.isReady ? <button className="Button" onClick={this.onStart.bind(this)}>Start</button> : ""
                    }
                    {
                        getShowJoinButton() ? <button className="Button" onClick={this.onJoin.bind(this)}>Join Match</button> : ""
                    }
                    <button className="Button" onClick={this.onBack.bind(this)}>Leave</button>

                </div>
                <p>Lobby ID: {this.props.lobby.lobbyId}</p>
            </div>
        )
    }
}

export default LobbyScreen;
