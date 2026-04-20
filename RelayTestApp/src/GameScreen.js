import React, { Component } from 'react'

let colors = require('./Colors').colors

const MATCH_DURATION_SEC = 90
const COUNTDOWN_FROM_SEC = 80

// Props:
// user
// lobby
// lobbyType
// disbandOnStart
// teams
// splotches
// splotchDurationSec
// gameStartTime
// relayOptions { reliable, ordered }
// numArrowImages
// onBack / onEndMatch / onClearSplotches
// onPlayerMove / onPlayerClicked
// onToggleReliable / onToggleOrdered / onTogglePlayerMask
class GameScreen extends Component {
  constructor () {
    super()
    this.mousePos = { x: 0, y: 0 }
    this.localPos = { x: 0, y: 0 }
  }

  componentDidMount () {
    // Re-render every second to update the game timer and splotch fade-out
    this.timerInterval = setInterval(() => this.forceUpdate(), 1000)
  }

  componentWillUnmount () {
    clearInterval(this.timerInterval)
  }

  onBack () {
    this.props.onBack()
  }
  onEndMatch () {
    this.props.onEndMatch()
  }
  onClearSplotches () {
    this.props.onClearSplotches()
  }

  onMouseMove (e) {
    let elem = document.querySelector('.GamePlayArea')
    let rect = elem.getBoundingClientRect()
    this.mousePos.x = (e.clientX - rect.left) / 800
    this.mousePos.y = (e.clientY - rect.top) / 600
    this.localPos = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    this.props.onPlayerMove(this.mousePos)
    this.forceUpdate()
  }

  onMouseClick (e) {
    this.props.onPlayerClicked(this.mousePos, e.button)
  }
  onToggleReliable () {
    this.props.onToggleReliable()
  }
  onToggleOrdered () {
    this.props.onToggleOrdered()
  }
  onTogglePlayerMask (cxId) {
    this.props.onTogglePlayerMask(cxId)
  }

  showEndMatchButton () {
    return (
      this.props.lobby.ownerCxId === this.props.user.cxId &&
      !this.props.disbandOnStart
    )
  }

  showClearSplotchesButton () {
    return this.props.lobby.ownerCxId === this.props.user.cxId
  }

  // Render a colored SVG cursor arrow matching the C++/Java vector arrow shape
  renderArrow (color) {
    return (
      <svg width='14' height='18' viewBox='0 0 14 18' style={{ display: 'block', overflow: 'visible' }}>
        <polygon
          points='0,0 0,14 5,9 7,13 9,11 7,7 11,7'
          fill={color}
          stroke='rgba(0,0,0,0.6)'
          strokeWidth='1'
          strokeLinejoin='round'
        />
      </svg>
    )
  }

  // Render the game timer. Shows countdown in the final 10 seconds.
  renderTimer () {
    if (!this.props.gameStartTime) return null
    let elapsedMs = Date.now() - this.props.gameStartTime
    let elapsedSec = Math.max(0, Math.floor(elapsedMs / 1000))
    let minutes = Math.floor(elapsedSec / 60)
    let seconds = elapsedSec % 60
    let timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`

    if (elapsedSec >= COUNTDOWN_FROM_SEC && elapsedSec < MATCH_DURATION_SEC) {
      let remaining = MATCH_DURATION_SEC - elapsedSec
      return (
        <p style={{ color: 'red', fontWeight: 'bold' }}>
          Ending in {remaining}...
        </p>
      )
    }

    return <p>Game Time: {timeStr}</p>
  }

  // Render persistent colour splotches, applying fade-out during the final 3 seconds of their life
  renderSplotches () {
    let now = Date.now()
    let duration = this.props.splotchDurationSec
    let numColors = colors.length

    return (this.props.splotches || [])
      .filter(splotch => {
        if (duration < 0) return true // forever
        return (now - splotch.startTimeMs) / 1000 < duration
      })
      .map((splotch, index) => {
        let opacity = 1.0
        if (duration > 0) {
          let ageSec = (now - splotch.startTimeMs) / 1000
          let remaining = duration - ageSec
          if (remaining <= 3) opacity = Math.max(0, remaining / 3.0)
        }
        let color = colors[splotch.colorIndex % numColors]
        return (
          <div
            key={`splotch_${index}_${splotch.startTimeMs}`}
            className='Entity'
            style={{
              left: `${splotch.x * 800 - 16}px`,
              top: `${splotch.y * 600 - 16}px`,
              opacity
            }}
          >
            <div className='Splotch' style={{ backgroundColor: color }}></div>
          </div>
        )
      })
  }

  render () {
    let numColors = colors.length

    return (
      <div className='GameScreen' style={{ display: 'flex' }}>
        {/** Info Area */}
        <div>
          {this.renderTimer()}

          {/** Players List / Mask */}
          <div
            className='OptionPanel'
            style={{ paddingRight: 32, textAlign: 'left' }}
          >
            <p>Player Mask (For splotches)</p>
            {this.props.lobby.members.map(member => {
              const ping = member.activePing
              let pingText = ''
              if (ping === undefined || ping === null || ping < 0) pingText = '...'
              else if (ping >= 999) pingText = 'T/O'
              else pingText = `${ping} ms`
              return (
                <div key={`${member.cxId}_mask`} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <input
                    type='checkbox'
                    name={`${member.cxId}_mask`}
                    onChange={() => this.onTogglePlayerMask(member.cxId)}
                    defaultChecked={member.allowSendTo}
                  />
                  <label
                    htmlFor={`${member.cxId}_mask`}
                    style={{ color: colors[member.extra.colorIndex % numColors] }}
                  >
                    {member.isReady ? member.name : member.name + ' (in lobby)'}
                  </label>
                  <span style={{ color: '#888888', fontSize: '11px' }}>{pingText}</span>
                </div>
              )
            })}
          </div>

          {/** Reliable/Ordered Options */}
          <div>
            <p>Reliable options (For mouse position)</p>
            <input
              type='checkbox'
              key='chkReliable'
              name='chkReliable'
              onChange={this.onToggleReliable.bind(this)}
              defaultChecked={this.props.relayOptions.reliable}
            />
            <label htmlFor='chkReliable'>Reliable</label>
            <br />
            <input
              type='checkbox'
              key='chkOrdered'
              name='chkOrdered'
              onChange={this.onToggleOrdered.bind(this)}
              defaultChecked={this.props.relayOptions.ordered}
            />
            <label htmlFor='chkOrdered'>Ordered</label>
          </div>

          {/** Team Instructions */}
          {this.props.teams.length > 1 ? (
            <div>
              <p>Instructions</p>
              <p>Left Click = Splotch everybody</p>
              <p>Right Click = Splotch team mates</p>
              <p>Middle Click = Splotch opponents</p>
            </div>
          ) : (
            ''
          )}
        </div>

        {/** Game Canvas */}
        <div>
          <div
            className='GamePlayArea'
            style={{
              cursor: 'none',
              float: 'left'
            }}
            onMouseMove={this.onMouseMove.bind(this)}
            onMouseDown={this.onMouseClick.bind(this)}
            onContextMenu={e => e.preventDefault()}
          >
            {/** Transient shockwave rings */}
            {(this.props.shockwaves || []).map(shockwave => (
              <div key={shockwave.id} className='Entity'
                style={{ left: `${shockwave.pos.x - 64}px`, top: `${shockwave.pos.y - 64}px` }}>
                <div className='Shockwave' style={{ backgroundColor: shockwave.color }} />
              </div>
            ))}

            {/** Persistent splotches */}
            {this.renderSplotches()}

            {/** All players' cursors (SVG arrow tinted to exact player color) */}
            {this.props.lobby.members
              .filter(member => member.isReady)
              .map(member => {
                let isLocal = member.cxId === this.props.user.cxId
                let px = isLocal
                  ? this.localPos.x
                  : (member.pos ? member.pos.x * 800 : -999)
                let py = isLocal
                  ? this.localPos.y
                  : (member.pos ? member.pos.y * 600 : -999)
                let color = colors[member.extra.colorIndex % numColors]
                return (
                  <div
                    key={`${member.cxId}_arrow`}
                    className='Entity'
                    style={{ left: `${px}px`, top: `${py}px` }}
                  >
                    {this.renderArrow(color)}
                    <p style={{ color, margin: 0, fontSize: '11px', whiteSpace: 'nowrap' }}>
                      {member.name}
                    </p>
                  </div>
                )
              })}
          </div>

          {/** Buttons */}
          <div>
            <button className='Button' onClick={this.onBack.bind(this)}>
              Leave Game
            </button>
            {this.showEndMatchButton() ? (
              <button className='Button' onClick={this.onEndMatch.bind(this)}>
                End Match
              </button>
            ) : (
              ''
            )}
            {this.showClearSplotchesButton() ? (
              <button
                className='Button'
                onClick={this.onClearSplotches.bind(this)}
              >
                Clear Splotches
              </button>
            ) : (
              ''
            )}
          </div>
        </div>
      </div>
    )
  }
}

export default GameScreen
