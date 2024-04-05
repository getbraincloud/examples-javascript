import React, { Component } from 'react'
import packageJson from '../package.json'
import ids from './ids'

// Props:
//  user
//  onPlay
//  onInventory
//  onHowTo
class MainMenuScreen extends Component
{
    onLogout()
    {
        this.props.onLogout()
    }
    
    onPlay()
    {
        this.props.onPlay(this.refs.lobbyTypes.options[this.refs.lobbyTypes.selectedIndex].value)
    }

    render()
    {
        let versionSuffix = (ids.url) ? " - dev" : " - prod"
        return (
            <div id="main-wrapper">
                <p className="text-small">Logged in as {this.props.user.name}</p>
                <label>Choose lobby type:</label>
                <select name="lobbyTypes" ref="lobbyTypes">
                    {
                        this.props.appLobbies.map((lobby) =>
                            <option value={lobby}>{lobby}</option>
                        )
                    }
                </select>
                <div className="btn-frame">
                    <button className="Button" onClick={this.onLogout.bind(this)}>LOG OUT</button>
                    <button className="Button" onClick={this.onPlay.bind(this)}>PLAY</button>
                </div>

                <div className="bottomText">
                    <small className="ver-text">Version: {packageJson.version}{versionSuffix}</small>
                </div>
            </div>
        )
    }
}

export default MainMenuScreen;
