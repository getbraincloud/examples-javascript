import React, { Component } from 'react'
import { rankColor } from './LeaderboardPanel'

let colors = require('./Colors').colors

const MATCH_DURATION_SEC = 90
const TIMER_WARN_SEC = 30
const TIMER_URGENT_SEC = 10
const SIDEBAR_WIDTH = 220

// Hold-to-paint: holding the left mouse button down auto-repeats a splotch at this fixed
// interval (the initial click still paints immediately) — same value across cpp/js/both
// Godot ports so holding paints at the same rate for everyone in a shared match.
const AUTO_PAINT_INTERVAL_MS = 150

// Props:
// user
// lobby
// lobbyType
// teams
// splotches
// splotchDurationSec
// gameStartTime
// relayOptions { reliable, ordered }
// coverage — live RANK/PLAYER/COVERAGE standings (App.tickMatch, ~every 250ms)
// numArrowImages
// onBack / onPlayerMove / onPlayerClicked
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
    this.stopAutoPaint()
  }

  // "Exit Match" — leaves the match for yourself only. There's no manual host "End
  // Match" override anymore (matches the cpp reference): a round always ends via the
  // host's auto-end sequence (App.tickMatch, MATCH_DURATION_SEC after it starts).
  onBack () {
    this.props.onBack()
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

  // Left-button hold starts auto-paint (in addition to the immediate click above); any
  // other button is just a single click, same as before.
  onMouseDown (e) {
    this.onMouseClick(e)
    if (e.button === 0) this.startAutoPaint()
  }

  onMouseUp () {
    this.stopAutoPaint()
  }

  startAutoPaint () {
    this.stopAutoPaint()
    this.autoPaintInterval = setInterval(() => {
      this.props.onPlayerClicked(this.mousePos, 0)
    }, AUTO_PAINT_INTERVAL_MS)
  }

  // Also called when the cursor leaves the play area — the DOM only reports mouse position
  // while inside it, so once outside there's no live position to keep painting at.
  stopAutoPaint () {
    if (this.autoPaintInterval) {
      clearInterval(this.autoPaintInterval)
      this.autoPaintInterval = null
    }
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

  // Render the game timer, colored by urgency in the closing seconds (matches the
  // cpp reference's red/orange countdown thresholds). Sits above the canvas, left of
  // the Exit Match button.
  renderTimer () {
    if (!this.props.gameStartTime) return null
    let elapsedMs = Date.now() - this.props.gameStartTime
    let elapsedSec = Math.max(0, Math.floor(elapsedMs / 1000))
    let remaining = Math.max(0, MATCH_DURATION_SEC - elapsedSec)
    let minutes = Math.floor(remaining / 60)
    let seconds = remaining % 60
    let timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`

    // Counts DOWN the whole match (matches cpp/Godot) — only the colour escalates as it
    // gets low, the format never swaps to a different "Ending in..." string.
    if (remaining <= TIMER_WARN_SEC) {
      let color = remaining <= TIMER_URGENT_SEC ? '#ff4d4d' : '#ffbf33'
      return <span style={{ color, fontWeight: 'bold' }}>Game Time: {timeStr}</span>
    }

    return <span>Game Time: {timeStr}</span>
  }

  // Single self-relay-RTT readout — ping lives outside the scoreboard sidebar entirely,
  // just below the timer/Exit Match row (matches the cpp reference).
  renderSelfPing () {
    const me = this.props.lobby.members.find(m => m.cxId === this.props.user.cxId)
    const ping = me ? me.activePing : undefined
    let text, color
    if (ping === undefined || ping === null || ping < 0) { text = '...'; color = '#888888' } else if (ping >= 999) {
      text = 'T/O'; color = '#ff4d4d'
    } else {
      text = `${ping} ms`
      color = ping < 100 ? '#66e585' : ping < 200 ? '#f2cc52' : '#ff4d4d'
    }
    return (
      <p style={{ margin: '4px 0 0' }}>
        <span style={{ color }}>{'●'}</span>{' '}
        <span className='text-small' style={{ opacity: 0.7 }}>Ping: {text}</span>
      </p>
    )
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
        let angle = splotch.angle || 0
        let splatUrl = `url(${process.env.PUBLIC_URL}/PaintSplatter1.png)`
        return (
          <div
            key={`splotch_${index}_${splotch.startTimeMs}`}
            className='Entity'
            style={{
              left: `${splotch.x * 800 - 32}px`,
              top: `${splotch.y * 600 - 32}px`,
              opacity
            }}
          >
            {/* Opaque player-colour mask + network-synced rotation so every client renders the same */}
            <div
              className='Splotch'
              style={{
                backgroundColor: color,
                transform: `rotate(${angle}rad)`,
                WebkitMaskImage: splatUrl,
                maskImage: splatUrl
              }}
            ></div>
          </div>
        )
      })
  }

  // Live RANK/PLAYER/COVERAGE standings — see coverage.js (App.tickMatch recomputes
  // this.props.coverage roughly every 250ms from the current splotches).
  renderScoreboard () {
    const coverage = this.props.coverage || []
    if (coverage.length === 0) return null
    const numColors = colors.length

    return (
      <div className='Scoreboard'>
        <div className='ScoreboardHeader'>
          <span>RANK / PLAYER</span>
          <span>COVERAGE</span>
        </div>
        {coverage.map(entry => {
          const member = this.props.lobby.members.find(m => m.cxId === entry.cxId)
          if (!member) return null
          const isMe = entry.cxId === this.props.user.cxId
          const colorIndex = member.extra ? member.extra.colorIndex : 0
          return (
            <div key={entry.cxId} className={`ScoreboardRow${isMe ? ' ScoreboardRowMe' : ''}`}>
              <span className='ScoreboardRank' style={{ color: rankColor(entry.rank) }}>#{entry.rank}</span>
              <span className='ScoreboardDot' style={{ backgroundColor: colors[colorIndex % numColors] }} />
              <span className='ScoreboardName' style={{ color: isMe ? '#59ff73' : 'white' }}>
                {member.name}{isMe ? ' (YOU)' : ''}
              </span>
              <span className='ScoreboardCoverage' style={{ color: isMe ? '#59ff73' : 'white' }}>
                {entry.coveragePct.toFixed(0)}%
              </span>
            </div>
          )
        })}
      </div>
    )
  }

  render () {
    let numColors = colors.length

    return (
      <div className='GameScreen' style={{ display: 'flex', alignItems: 'flex-start', gap: '24px', position: 'relative' }}>
        {/** Docked full-height scoreboard sidebar — RANK/PLAYER/COVERAGE only, matching the cpp reference */}
        <div className='Card' style={{ width: `${SIDEBAR_WIDTH}px`, minHeight: 0 }}>
          {this.renderScoreboard()}
        </div>

        {/** Game area: timer/ping/Exit Match header above the canvas */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ textAlign: 'left' }}>
              {this.renderTimer()}
              {this.renderSelfPing()}
            </div>
            <button className='Button' onClick={this.onBack.bind(this)}>
              {'↩'} Exit Match
            </button>
          </div>

          <div
            className='GamePlayArea'
            style={{
              cursor: 'none',
              float: 'left'
            }}
            onMouseMove={this.onMouseMove.bind(this)}
            onMouseDown={this.onMouseDown.bind(this)}
            onMouseUp={this.onMouseUp.bind(this)}
            onMouseLeave={this.onMouseUp.bind(this)}
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

          {/** Team Instructions */}
          {this.props.teams.length > 1 ? (
            <div style={{ textAlign: 'left', marginTop: '8px' }}>
              <p className='text-small' style={{ opacity: 0.6, margin: '2px 0' }}>Left Click = Splotch everybody</p>
              <p className='text-small' style={{ opacity: 0.6, margin: '2px 0' }}>Right Click = Splotch team mates</p>
              <p className='text-small' style={{ opacity: 0.6, margin: '2px 0' }}>Middle Click = Splotch opponents</p>
            </div>
          ) : (
            ''
          )}
        </div>

        {/** Debug/settings panel — floating bottom-right, matches the cpp reference's
            Debug window (region/round/lobby + Reliable/Ordered/Channel controls; the
            per-player send-mask list lives here too since this app needs a place for it). */}
        <div className='DebugPanel'>
          {this.props.lobby && this.props.lobby.lobbyId ? (
            <p className='text-small' style={{ opacity: 0.5, margin: '0 0 6px' }}>Lobby: {this.props.lobby.lobbyId}</p>
          ) : null}

          <p className='text-small' style={{ opacity: 0.6, margin: '0 0 4px' }}>Player Mask (for splotches)</p>
          {this.props.lobby.members.map(member => {
            const ping = member.activePing
            let pingText = ''
            let pingColor = '#888888'
            if (ping === undefined || ping === null || ping < 0) pingText = '...'
            else if (ping >= 999) { pingText = 'T/O'; pingColor = '#ff4d4d' } else {
              pingText = `${ping} ms`
              pingColor = ping < 100 ? '#66e585' : ping < 200 ? '#f2cc52' : '#ff4d4d'
            }
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
                <span style={{ color: pingColor, fontSize: '11px' }}>{pingText}</span>
              </div>
            )
          })}

          <hr className='lbDivider' />
          <p className='text-small' style={{ opacity: 0.6, margin: '0 0 4px' }}>Reliable options (for mouse position)</p>
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
      </div>
    )
  }
}

export default GameScreen
