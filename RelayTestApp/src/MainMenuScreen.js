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
                    <option value="CursorPartyV2">CursorPartyV2</option>
                    <option value="CursorPartyV2Backfill">CursorPartyV2Backfill</option>
                    <option value="CursorPartyGameLift">CursorPartyGameLift</option>
                    <option value="TeamCursorPartyV2">TeamCursorPartyV2</option>
                    <option value="TeamCursorPartyV2Backfill">TeamCursorPartyV2Backfill</option>
                </select>
                <div className="btn-frame">
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
