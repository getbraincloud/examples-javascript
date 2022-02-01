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
        this.props.onPlay(this.refs.hosting.options[this.refs.hosting.selectedIndex].value)
    }

    render()
    {
        let versionSuffix = (ids.url) ? " - dev" : " - prod"
        return (
            <div id="main-wrapper">
                <p className="text-small">Logged in as {this.props.user.name}</p>
                <label>Choose hosting service:</label>
                <select name="hosting" ref="hosting">
                    <option value="CursorPartyV2">brainCloud</option>
                    <option value="CursorPartyV2Backfill">brainCloud Backfill</option>
                    <option value="CursorPartyV2LongLive">brainCloud Long Live</option>
                    <option value="CursorPartyGameLift">GameLift</option>
                </select>
                <div className="btn-frame">
                    <button className="Button" onClick={this.onPlay.bind(this)}>PLAY GAME</button>
                </div>

                <div className="bottomText">
                    <small className="ver-text">Version: {packageJson.version}{versionSuffix}</small>
                </div>
            </div>
        )
    }
}

export default MainMenuScreen;
