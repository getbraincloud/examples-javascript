import React, { Component } from 'react'

let colors = require('./Colors').colors

// Props:
// user
// lobby
// pings
// relayOptions
//   reliable
//   ordered
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

    onToggleReliable(e)
    {
        this.props.onToggleReliable()
    }

    onToggleOrdered(e)
    {
        this.props.onToggleOrdered()
    }

    onTogglePlayerMask(cxId)
    {
        this.props.onTogglePlayerMask(cxId)
    }

    render()
    {
        return (
            <div className="GameScreen">
                <div>
                    <div className="OptionPanel" ref="OptionPanel" style={{float:"left", paddingRight:32, textAlign:"left"}}>
                        <p>Player Mask (For shockwaves)</p>
                        {
                            this.props.lobby.members.map(member => (
                                <div key={`${member.cxId}_mask`}>
                                    <input type="checkbox" name={`${member.cxId}_mask`} onChange={() => this.onTogglePlayerMask(member.cxId)} defaultChecked={member.allowSendTo}/>
                                    <label htmlFor={`${member.cxId}_mask`}>{member.name}</label>
                                </div>
                            ))
                        }
                        <p>Reliable options (For mouse position)</p>
                        <input type="checkbox" key="chkReliable" name="chkReliable" onChange={this.onToggleReliable.bind(this)} defaultChecked={this.props.relayOptions.reliable}/>
                        <label htmlFor="chkReliable">Reliable</label><br/>
                        <input type="checkbox" key="chkOrdered" name="chkOrdered" onChange={this.onToggleOrdered.bind(this)} defaultChecked={this.props.relayOptions.ordered}/>
                        <label htmlFor="chkOrdered">Ordered</label>
                    </div>
                    <div className="GamePlayArea" ref="GamePlayArea" style={{cursor: `url('arrow${this.props.user.colorIndex}.png'), auto`, float:"left"}} 
                        onMouseMove={this.onMouseMove.bind(this)} onMouseDown={this.onShocwave.bind(this)}>
                        {
                            this.props.shockwaves.map(shockwave => (
                                <div key={`${shockwave.id}`} className="Entity" style={{left: `${shockwave.pos.x-64}px`, top: `${shockwave.pos.y-64}px`}}>
                                    <div className="Shockwave" style={{backgroundColor: shockwave.color}}></div>
                                </div>
                            ))
                        }
                        {
                            this.props.lobby.members.filter(member => member.pos && member.cxId !== this.props.user.cxId).map(member => (
                                <div key={`${member.cxId}_arrow`} className="Entity" style={{left: `${member.pos.x}px`, top: `${member.pos.y}px`}}>
                                    <img className="Arrow" src={`arrow${member.extra.colorIndex}.png`} alt="arrow"/>
                                    <p style={{color: colors[member.extra.colorIndex]}}>{member.name}</p>
                                </div>
                            ))
                        }
                    </div>
                </div>
                <button className="Button" onClick={this.onBack.bind(this)}>Leave Game</button>
                <p>{this.props.lobby.timeLeft ? ("Time left: " + this.props.lobby.timeLeft + " seconds") : ""}</p>
            </div>
        )
    }
}

export default GameScreen;
