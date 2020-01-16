import React, { Component } from 'react'

let colors = require('./Colors').colors

// Props:
// user
// lobby
// pings
class GameScreen extends Component
{
    constructor()
    {
        super()
        this.mousePos = {x: 0, y: 0}
    }

    onBack()
    {
        this.props.onBack()
    }

    onMouseMove(e)
    {
        var rect = this.refs.GamePlayArea.getBoundingClientRect();
        this.mousePos.x = Math.floor(e.clientX - rect.left);
        this.mousePos.y = Math.floor(e.clientY - rect.top);
        this.props.onPlayerMove(this.mousePos)
    }

    onShocwave(e)
    {
        this.props.onPlayerShockwave(this.mousePos)
    }
    
    render()
    {
        return (
            <div className="GameScreen">
                <div className="GamePlayArea" ref="GamePlayArea" style={{cursor: `url('arrow${this.props.user.colorIndex}.png'), auto`}} onMouseMove={this.onMouseMove.bind(this)} onMouseDown={this.onShocwave.bind(this)}>
                    {
                        this.props.shockwaves.map(shockwave => (
                            <div key={`${shockwave.id}`} className="Entity" style={{left: `${shockwave.pos.x-64}px`, top: `${shockwave.pos.y-64}px`}}>
                                <div className="Shockwave" style={{backgroundColor: shockwave.color}}></div>
                            </div>
                        ))
                    }
                    {
                        this.props.lobby.members.filter(member => member.pos && member.profileId != this.props.user.id).map(member => (
                            <div key={`${member.profileId}_arrow`} className="Entity" style={{left: `${member.pos.x}px`, top: `${member.pos.y}px`}}>
                                <img className="Arrow" src={`arrow${member.extra.colorIndex}.png`} alt="arrow"/>
                                <p style={{color: colors[member.extra.colorIndex]}}>{member.name}</p>
                            </div>
                        ))
                    }
                </div>
                <button className="Button" onClick={this.onBack.bind(this)}>Leave Game</button>
            </div>
        )
    }
}

export default GameScreen;
