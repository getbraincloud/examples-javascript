import React, { Component } from 'react'
import './MainMenuScreen.css'
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
        this.props.onPlay()
    }

    onInventory()
    {
        this.props.onInventory()
    }

    onHowTo()
    {
        this.props.onHowTo()
    }

    render()
    {
        let versionSuffix = (ids.url) ? " - dev" : " - prod"
        return (
            <div className="MainMenuScreen">
                <p>Logged in as {this.props.user.name}</p>
                
                <div class="btn-group" align="center">
                    <button class="btn" onClick={this.onPlay.bind(this)}>PLAY GAME</button>
                    <button class="btn" onClick={this.onInventory.bind(this)}>INVENTORY</button>
                    <button class="btn" onClick={this.onHowTo.bind(this)}>HOW TO PLAY</button>
                    </div>

                <small>Version: {packageJson.version}{versionSuffix}</small>
            </div>
        )
    }
}
export default MainMenuScreen;
