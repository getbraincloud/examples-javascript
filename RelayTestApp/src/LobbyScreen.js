import React, { Component } from 'react'

import { getShowJoinButton } from './App'
import GlobalChatPanel from './GlobalChatPanel'
import LeaderboardPanel, { rankColor } from './LeaderboardPanel'

let colors = require('./Colors').colors

// Extracts the region prefix from a brainCloud lobbyId (format: "region:LobbyType:N").
// Returns empty string if the lobbyId is missing, has no colon, or the prefix is all digits (appId).
function regionFromLobbyId (lobbyId) {
  if (!lobbyId) return ''
  let pos = lobbyId.indexOf(':')
  if (pos <= 0) return ''
  let prefix = lobbyId.substring(0, pos)
  if (/^\d+$/.test(prefix)) return ''
  return prefix
}

// Props:
// user
// lobby
// teams
// lobbyResetting
// usePingData
// pingData
// bcWrapper
// isProvisioning / provisioningStatus — non-blocking "starting the next round" banner
// awaitingRematch — true between END_MATCH and the next round actually starting
// matchResult — last finished round's standings (valid/round/entries), for the INFO tab
// onBack / onColorChanged / onTeamChanged / onStart / onJoin / onSendLobbySignal
class LobbyScreen extends Component {
  constructor (props) {
    super(props)
    this.state = { rightTab: 'chat', chatSubTab: 'lobby', signalInput: '', colorPickerOpen: false }
    this.arrivalTime = Date.now()
  }

  componentDidMount () {
    // Live-updates the INFO tab's "time in lobby" clock.
    this.tickInterval = setInterval(() => this.forceUpdate(), 1000)
  }

  componentWillUnmount () {
    clearInterval(this.tickInterval)
  }

  onBack () {
    this.props.onBack()
  }

  onStart () {
    this.props.onStart()
  }

  onJoin () {
    this.props.onJoin()
  }

  onColorSelected (index) {
    this.props.user.colorIndex = index
    let me = this.props.lobby.members.find(
      member => member.cxId === this.props.user.cxId
    )
    if (me) {
      me.extra.colorIndex = index
    }
    localStorage.setItem('color', '' + index)
    this.props.onColorChanged(index)
    this.setState({ colorPickerOpen: false })
  }

  toggleColorPicker () {
    this.setState(s => ({ colorPickerOpen: !s.colorPickerOpen }))
  }

  onTeamSelected (teamName) {
    console.log('User trying to join team ' + teamName)
    this.props.onTeamChanged(teamName)
  }

  setRightTab (tab) {
    this.setState({ rightTab: tab })
  }

  setChatSubTab (tab) {
    this.setState({ chatSubTab: tab })
  }

  onSignalInputChange (e) {
    this.setState({ signalInput: e.target.value })
  }

  onSignalKeyDown (e) {
    if (e.key === 'Enter') this.sendSignal()
  }

  sendSignal () {
    const text = this.state.signalInput
    if (!text.trim()) return
    this.props.onSendLobbySignal(text)
    this.setState({ signalInput: '' })
  }

  // This-lobby chat (Lobby service SendSignal — state.lobby.chatMessages, appended to
  // by App.onSendLobbySignal on send and the SIGNAL case in onLobbyEvent on receive).
  renderLobbySignalChat () {
    const messages = this.props.lobby.chatMessages || []
    return (
      <div className='GlobalChatPanel'>
        <div className='chatScroll'>
          {messages.map((m, i) => (
            <p key={i} className='chatLine'>
              <span className='chatFrom'>{m.fromName}:</span> {m.text}
            </p>
          ))}
        </div>
        <div className='chatInputRow'>
          <input
            type='text'
            value={this.state.signalInput}
            onChange={this.onSignalInputChange.bind(this)}
            onKeyDown={this.onSignalKeyDown.bind(this)}
            placeholder='Say something...'
          />
          <button className='Button chatSendBtn' onClick={this.sendSignal.bind(this)}>Send</button>
        </div>
      </div>
    )
  }

  renderChatTab () {
    return (
      <>
        <div className='lbToggleRow'>
          <button
            className={`lbToggleBtn${this.state.chatSubTab === 'lobby' ? ' active' : ''}`}
            onClick={this.setChatSubTab.bind(this, 'lobby')}
          >THIS LOBBY</button>
          <button
            className={`lbToggleBtn${this.state.chatSubTab === 'global' ? ' active' : ''}`}
            onClick={this.setChatSubTab.bind(this, 'global')}
          >GLOBAL</button>
        </div>
        <hr className='lbDivider' />
        {this.state.chatSubTab === 'lobby' ? (
          this.renderLobbySignalChat()
        ) : (
          <GlobalChatPanel bcWrapper={this.props.bcWrapper} />
        )}
      </>
    )
  }

  // INFO tab — lobby id/region/player count/time-in-lobby + ping data (when enabled).
  renderInfoTab () {
    const lobbyRegionId = regionFromLobbyId(this.props.lobby.lobbyId)
    const secondsInLobby = Math.floor((Date.now() - this.arrivalTime) / 1000)
    const mm = Math.floor(secondsInLobby / 60)
    const ss = String(secondsInLobby % 60).padStart(2, '0')

    return (
      <div className='text-small' style={{ textAlign: 'left' }}>
        <p>Lobby: {this.props.lobby.lobbyId}</p>
        {lobbyRegionId ? <p>Region: {lobbyRegionId}</p> : null}
        <p>Players: {this.props.lobby.members.length}</p>
        <p>Time in lobby: {mm}:{ss}</p>
        {this.renderLastMatchResults()}
        {this.renderPingTable()}
      </div>
    )
  }

  // Last match results — shown once a round finishes (App.state.matchResult) until the
  // next round starts. Entries are already in rank order (see coverage.js).
  renderLastMatchResults () {
    const matchResult = this.props.matchResult
    if (!matchResult || !matchResult.valid) return null

    return (
      <div style={{ marginTop: '12px' }}>
        <hr className='lbDivider' />
        <p style={{ margin: '4px 0', fontWeight: 'bold', opacity: 0.6 }}>Last Match Results</p>
        {matchResult.entries.map(entry => {
          const member = this.props.lobby.members.find(m => m.cxId === entry.cxId)
          const name = member ? member.name : '?'
          const isMe = entry.cxId === this.props.user.cxId
          return (
            <p key={entry.cxId} style={{ margin: '2px 0' }}>
              <span style={{ color: rankColor(entry.rank), fontWeight: 'bold' }}>#{entry.rank}</span>{' '}
              <span style={isMe ? { color: '#59ff73' } : {}}>
                {name}  {entry.coveragePct.toFixed(1)}%  (+{entry.beaten + 1} pts)
              </span>
            </p>
          )
        })}
      </div>
    )
  }

  // Render the ping data table — only shown when usePingData is true and there is data
  renderPingTable () {
    if (!this.props.usePingData) return null

    const pingData = this.props.pingData || {}
    const members = this.props.lobby.members || []

    // Collect all unique region names from our own pingData and from members' extra.pings
    let regionSet = new Set(Object.keys(pingData))
    members.forEach(m => {
      if (m.extra && m.extra.pings) {
        Object.keys(m.extra.pings).forEach(r => regionSet.add(r))
      }
    })
    let regions = Array.from(regionSet).sort()
    if (regions.length === 0) return null

    // Color the lobby region label green/red based on ping match quality
    const lobbyRegionId = regionFromLobbyId(this.props.lobby.lobbyId)
    let regionLabel = null
    if (lobbyRegionId) {
      const THRESHOLD_MS = 30
      let regionColor = 'gray'
      if (Object.keys(pingData).length > 0) {
        const lobbyPing = pingData[lobbyRegionId]
        if (lobbyPing !== undefined) {
          const bestPing = Math.min(...Object.values(pingData))
          regionColor = (lobbyPing - bestPing <= THRESHOLD_MS) ? '#44ee44' : '#ee4444'
        }
      }
      regionLabel = (
        <p style={{ color: regionColor, margin: '4px 0' }}>
          Region: {lobbyRegionId}
        </p>
      )
    }

    const monoStyle = { fontFamily: 'monospace', fontSize: '12px', color: '#aaaaaa' }
    return (
      <div style={{ marginTop: '12px' }}>
        {regionLabel}
        <p style={{ margin: '4px 0', fontWeight: 'bold' }}>Ping Data (ms)</p>
        <table style={monoStyle}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', paddingRight: '12px' }}>Player</th>
              {regions.map(r => (
                <th key={r} style={{ paddingRight: '8px' }}>{r}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {members.map(member => {
              // Prefer member.extra.pings; fall back to own pingData for local player
              let pings = (member.extra && member.extra.pings) ? member.extra.pings : null
              if (!pings && member.cxId === this.props.user.cxId && Object.keys(pingData).length > 0) {
                pings = pingData
              }
              if (!pings) return null
              const isMe = member.cxId === this.props.user.cxId
              const nameColor = colors[member.extra.colorIndex % colors.length]
              return (
                <tr key={member.cxId} style={isMe ? { color: nameColor } : {}}>
                  <td style={{ paddingRight: '12px' }}>
                    {member.name}{member.cxId === this.props.lobby.ownerCxId ? ' [Host]' : ''}
                  </td>
                  {regions.map(r => {
                    const ms = pings[r]
                    let txt = '-'
                    if (ms !== undefined) txt = ms >= 999 ? 'T/O' : String(ms)
                    return <td key={r} style={{ textAlign: 'right', paddingRight: '8px' }}>{txt}</td>
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }

  // Colour picker — a small popup under your own swatch, not an always-visible 40-swatch
  // grid (only shown in FFA; team colour is auto-assigned by team).
  renderColorPicker () {
    if (!this.state.colorPickerOpen) return null
    return (
      <div className='ColorPickerPopup'>
        {colors.map((color, i) => (
          <div
            key={color + i}
            className='colorBtn'
            style={{ backgroundColor: color }}
            onClick={this.onColorSelected.bind(this, i)}
            title={i}
          />
        ))}
      </div>
    )
  }

  // A member's row — colour swatch (clickable, opens the picker, on your own row in FFA
  // lobbies), name, YOU/HOST badges, ready-state line. Used by both FFA and team member
  // lists.
  renderMemberRow (member) {
    const isMe = member.cxId === this.props.user.cxId
    const isHost = member.cxId === this.props.lobby.ownerCxId
    const color = colors[member.extra.colorIndex % colors.length]
    const canPickColor = isMe && this.props.teams.length === 1

    return (
      <li key={member.cxId} className='memberRow'>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            className='memberSwatch'
            style={{ backgroundColor: color, cursor: canPickColor ? 'pointer' : 'default' }}
            onClick={canPickColor ? this.toggleColorPicker.bind(this) : undefined}
          />
          <span style={{ color: isMe ? '#59ff73' : 'white' }}>{member.name}</span>
          {isMe ? <span className='memberBadge'>YOU</span> : null}
          {isHost ? <span className='memberBadge memberBadgeHost'>HOST</span> : null}
        </div>
        {canPickColor ? this.renderColorPicker() : null}
        <p className='memberStatus'>{member.isReady ? 'Ready' : 'Not ready'}</p>
      </li>
    )
  }

  // Small non-blocking status line shown while a round is being provisioned (STARTING ->
  // ROOM_READY) — the rest of the Lobby screen (chat, member list, etc.) stays fully
  // usable underneath it instead of being replaced by a blocking loading screen.
  renderProvisioningBanner () {
    if (!this.props.isProvisioning) return null
    return (
      <div className='ProvisioningBanner'>
        Starting round... {this.props.provisioningStatus}
      </div>
    )
  }

  render () {
    return (
      <div className='LobbyScreen'>
        {this.renderProvisioningBanner()}
        <div className='CardsRow'>
          <div className='Card'>
            <p style={{ margin: '0 0 4px', fontWeight: 'bold' }}>Lobby</p>
            <hr className='lbDivider' />
            <p className='text-small' style={{ opacity: 0.6, margin: '0 0 6px' }}>Members</p>
            <div className='memberListScroll'>
              {this.props.teams.map((team, index) => (
                <div key={team.name}>
                  {this.props.teams.length > 1 ? (
                    <button
                      key={index}
                      className='teamBtn'
                      onClick={this.onTeamSelected.bind(this, team.name)}
                    >
                      Join Team {team.name}
                    </button>
                  ) : (
                    ''
                  )}
                  <ul style={{ listStyle: 'none', paddingLeft: 0, margin: 0 }}>
                    {team.members.map(member => this.renderMemberRow(member))}
                  </ul>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 'auto' }}>
              <button className='Button' onClick={this.onBack.bind(this)}>
                Leave
              </button>
              {this.props.lobby.ownerCxId === this.props.user.cxId && this.props.awaitingRematch ? (
                // Rematch flow is fully automatic (App.tickRematchGate) — no manual
                // override here, so a host who returns early can't skip the "wait for
                // stragglers or 45s" window.
                <p className='text-small' style={{ opacity: 0.6, margin: '8px 0' }}>
                  Waiting for other players to return...
                </p>
              ) : this.props.lobby.ownerCxId === this.props.user.cxId &&
              !this.props.user.isReady ? (
                <button
                  className='Button ButtonPrimary'
                  onClick={this.onStart.bind(this)}
                  disabled={this.props.lobbyResetting}
                >
                  Start
                </button>
              ) : (
                ''
              )}
              {getShowJoinButton() ? (
                <button className='Button ButtonPrimary' onClick={this.onJoin.bind(this)}>
                  Join Match
                </button>
              ) : (
                ''
              )}
            </div>
          </div>

          <div className='Card CardRight'>
            <div className='CardTabRow'>
              <button
                className={`CardTabBtn${this.state.rightTab === 'chat' ? ' active' : ''}`}
                onClick={this.setRightTab.bind(this, 'chat')}
              >CHAT</button>
              <button
                className={`CardTabBtn${this.state.rightTab === 'leaderboards' ? ' active' : ''}`}
                onClick={this.setRightTab.bind(this, 'leaderboards')}
              >LEADERBOARDS</button>
              <button
                className={`CardTabBtn${this.state.rightTab === 'info' ? ' active' : ''}`}
                onClick={this.setRightTab.bind(this, 'info')}
              >INFO</button>
            </div>
            {this.state.rightTab === 'chat' ? this.renderChatTab() : null}
            {this.state.rightTab === 'leaderboards' ? <LeaderboardPanel bcWrapper={this.props.bcWrapper} /> : null}
            {this.state.rightTab === 'info' ? this.renderInfoTab() : null}
          </div>
        </div>
      </div>
    )
  }
}

export default LobbyScreen
