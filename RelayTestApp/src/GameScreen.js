import React, { Component } from 'react'

let colors = require('./Colors').colors

// Props:
// user
// lobby
// lobby type
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

    onEndMatch() {
        this.props.onEndMatch()
    }

    onMouseMove(e)
    {
        var rect = this.refs.GamePlayArea.getBoundingClientRect();
        this.mousePos.x = ((e.clientX - rect.left) / 800);
        this.mousePos.y = ((e.clientY - rect.top) / 600);

        this.props.onPlayerMove(this.mousePos)
    }

    onMouseClick(e)
    {
        this.props.onPlayerClicked(this.mousePos, e.button)
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

    showEndMatchButton(){
        
        // End match should only be optional to the lobby owner / host. The "CursorPartyGameLift" lobby type is configured to "disband on start" which means END_MATCH is not possible
        if(this.props.lobby.ownerCxId === this.props.user.cxId && !this.props.disbandOnStart){
            return true
        }

        return false
    }
    render() {
        return (
            <div className="GameScreen" style={{ display: "flex" }}>
                {/** Info Area */}
                <div>
                    {/** Players List */}
                    <div className="OptionPanel" ref="OptionPanel" style={{paddingRight: 32, textAlign: "left" }}>
                        <p>Player Mask (For shockwaves)</p>
                        {
                            this.props.lobby.members.map(member => (
                                <div key={`${member.cxId}_mask`}>
                                    <input type="checkbox" name={`${member.cxId}_mask`} onChange={() => this.onTogglePlayerMask(member.cxId)} defaultChecked={member.allowSendTo} />
                                    {
                                        member.isReady === true ? <label htmlFor={`${member.cxId}_mask`} style={{ color: colors[member.extra.colorIndex] }}>{member.name}</label> : <label htmlFor={`${member.cxId}_mask`} style={{ color: colors[member.extra.colorIndex] }}>{member.name + " (in lobby)"}</label>
                                    }
                                </div>
                            ))
                        }
                    </div>

                    {/** Options */}
                    <div>
                        <p>Reliable options (For mouse position)</p>
                        <input type="checkbox" key="chkReliable" name="chkReliable" onChange={this.onToggleReliable.bind(this)} defaultChecked={this.props.relayOptions.reliable} />
                        <label htmlFor="chkReliable">Reliable</label><br />
                        <input type="checkbox" key="chkOrdered" name="chkOrdered" onChange={this.onToggleOrdered.bind(this)} defaultChecked={this.props.relayOptions.ordered} />
                        <label htmlFor="chkOrdered">Ordered</label>
                    </div>

                    {/** Instructions */}
                    {
                        this.props.teams.length > 1
                            ?
                            <div>
                                <p>Instructions</p>
                                <p>Left Click = Send shockwaves to everybody</p>
                                <p>Right Click = Send shockwaves to team mates</p>
                                <p>Middle Click = Send shockwaves to opponents</p>
                            </div>
                            : ""
                    }
                </div>

                {/** Game Side */}
                <div>
                    {/** Cursor Party */}
                    <div className="GamePlayArea" ref="GamePlayArea" style={{ cursor: `url('arrow${this.props.user.colorIndex}.png'), auto`, float: "left" }}
                        onMouseMove={this.onMouseMove.bind(this)} onMouseDown={this.onMouseClick.bind(this)} onContextMenu={(e) => e.preventDefault()}>
                        {
                            this.props.shockwaves.map(shockwave => (
                                <div key={`${shockwave.id}`} className="Entity" style={{ left: `${shockwave.pos.x - 64}px`, top: `${shockwave.pos.y - 64}px` }}>
                                    <div className="Shockwave" style={{ backgroundColor: shockwave.color }}></div>
                                </div>
                            ))
                        }
                        {
                            this.props.lobby.members.filter(member => member.pos && member.cxId !== this.props.user.cxId).map(member => (
                                <div key={`${member.cxId}_arrow`} className="Entity" style={{ left: `${member.pos.x * 800}px`, top: `${member.pos.y * 600}px` }}>
                                    <img className="Arrow" src={`arrow${member.extra.colorIndex}.png`} alt="arrow" />
                                    <p style={{ color: colors[member.extra.colorIndex] }}>{member.name}</p>
                                </div>
                            ))
                        }
                    </div>
                    {/** Buttons */}
                    <div>
                        <button className="Button" onClick={this.onBack.bind(this)}>Leave Game</button>
                        {
                            this.showEndMatchButton() ? <button className="Button" onClick={this.onEndMatch.bind(this)}>End Match</button> : ""
                        }
                    </div>
                </div>

                <button className="Button" onClick={this.onBack.bind(this)}>Leave Game</button>
                {
                    this.showEndMatchButton() ? <button className="Button" onClick={this.onEndMatch.bind(this)}>End Match</button> : ""
                }
            </div>
        )
    }
}

export default GameScreen;
