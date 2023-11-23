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

    render() {
        return (
            <div className="LobbyScreen">
                <div>
                    {
                        colors.map((color, i) => (<div key={color} className="colorBtn" style={{ backgroundColor: color, display: "inline-block", width: "50px", height: "40px" }} onClick={this.onColorSelected.bind(this, i)}>{i}</div>))
                    }
                </div>
                <ul>
                    {
                        this.props.lobby.members.map(member => (<li key={member.cxId} style={{ color: colors[member.extra.colorIndex] }}>{member.name}</li>))
                    }
                </ul>
                {
                    this.props.lobby.ownerCxId === this.props.user.cxId && !this.props.user.isReady ? <button className="Button" onClick={this.onStart.bind(this)}>Start</button> : ""
                }
                {
                    getShowJoinButton() ? <button className="Button" onClick={this.onJoin.bind(this)}>Join Match</button> : ""
                }
                <button className="Button" onClick={this.onBack.bind(this)}>Leave</button>
                <p>Lobby ID: {this.props.lobby.lobbyId}</p>
            </div>
        )
    }
}

export default LobbyScreen;
