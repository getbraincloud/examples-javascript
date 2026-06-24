import React, { Component } from 'react'

import { getShowJoinButton } from './App'

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
// usePingData
// pingData
class LobbyScreen extends Component {
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
  }

  onTeamSelected (teamName) {
    console.log('User trying to join team ' + teamName)
    this.props.onTeamChanged(teamName)
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

  render () {
    return (
      <div className='LobbyScreen'>
        <div>
          {
            /** If there are no teams, users can select their own colour. Otherwise, colour will initially be assigned automatically by team. */
            this.props.teams.length === 1 ? (
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  maxWidth: '320px',
                  justifyContent: 'flex-start'
                }}
              >
                {colors.map((color, i) => (
                  <div
                    key={color + i}
                    className='colorBtn'
                    style={{
                      backgroundColor: color,
                      display: 'inline-block',
                      width: '28px',
                      height: '24px'
                    }}
                    onClick={this.onColorSelected.bind(this, i)}
                    title={i}
                  />
                ))}
              </div>
            ) : (
              ''
            )
          }
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
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
              <ul>
                {team.members.map(member =>
                  member.cxId === this.props.lobby.ownerCxId ? (
                    <li
                      key={member.cxId}
                      style={{ color: colors[member.extra.colorIndex] }}
                    >
                      {member.name + ' (host)'}
                    </li>
                  ) : (
                    <li
                      key={member.cxId}
                      style={{ color: colors[member.extra.colorIndex] }}
                    >
                      {member.name}
                    </li>
                  )
                )}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button className='Button' onClick={this.onBack.bind(this)}>
            Leave
          </button>
          {this.props.lobby.ownerCxId === this.props.user.cxId &&
          !this.props.user.isReady ? (
            <button
              className='Button'
              onClick={this.onStart.bind(this)}
              disabled={this.props.lobbyResetting}
            >
              Start
            </button>
          ) : (
            ''
          )}
          {getShowJoinButton() ? (
            <button className='Button' onClick={this.onJoin.bind(this)}>
              Join Match
            </button>
          ) : (
            ''
          )}
        </div>
        <p>Lobby ID: {this.props.lobby.lobbyId}</p>
        {this.renderPingTable()}
      </div>
    )
  }
}

export default LobbyScreen
