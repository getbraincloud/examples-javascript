import React, { Component } from 'react'
import './style.css'
import packageJson from '../package.json'
import ids from './ids'

// Props:
//  user
//  onPlay
//  onHowTo
class MainMenuScreen extends Component {
    onPlay() {
        this.props.onPlay()
    }

    onHowTo() {
        this.props.onHowTo()
    }

    onLogout(){
        this.props.onLogout()
    }

    render() {
        let versionSuffix = (ids.url) ? " - dev" : " - prod"
        return (
            <div id="main-wrapper">
                <p className="text-small">Logged in as {this.props.user.name}</p>
                <div className="btn-frame">
                    <button className="btn-green-long" onClick={this.onPlay.bind(this)}>PLAY GAME</button>
                </div>

                <div className="btn-frame">
                    <button className="btn-green-long" onClick={this.onHowTo.bind(this)}>HOW TO PLAY</button>
                </div>

                <div className="btn-frame">
                    <button className="btn-green-long" onClick={this.onLogout.bind(this)}>LOG OUT</button>
                </div>

                <div className="bottomText">
                    <p className="ver-text">Version: {packageJson.version}{versionSuffix}</p>
                </div>
            </div>
        )
    }
}
export default MainMenuScreen;
