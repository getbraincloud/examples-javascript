import React, { Component } from 'react'

// Props:
//  text        — primary message
//  statusText  — secondary status line (e.g. "Provisioning server...")
//  lobbyId     — shown when available
//  startTime   — Date.now() timestamp, drives the elapsed timer
//  onBack      — if provided, shows a Cancel button
class LoadingScreen extends Component {
  componentDidMount () {
    if (this.props.startTime) {
      this.timerInterval = setInterval(() => this.forceUpdate(), 1000)
    }
  }

  componentWillUnmount () {
    clearInterval(this.timerInterval)
  }

  renderTimer () {
    if (!this.props.startTime) return null
    let elapsedSec = Math.max(
      0,
      Math.floor((Date.now() - this.props.startTime) / 1000)
    )
    let minutes = Math.floor(elapsedSec / 60)
    let seconds = elapsedSec % 60
    let timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`

    // Warn after 60 seconds — a new server may be warming up
    let isLong = elapsedSec >= 60
    return (
      <p
        style={{
          color: isLong ? '#ffcc44' : 'white',
          fontWeight: isLong ? 'bold' : 'normal'
        }}
      >
        {timeStr}
        {isLong ? ' — server may be warming up...' : ''}
      </p>
    )
  }

  render () {
    return (
      <div className='LoadingScreen'>
        <p>{this.props.text}</p>
        {this.renderTimer()}
        {this.props.statusText ? (
          <p style={{ opacity: 0.65, fontSize: '10pt' }}>
            {this.props.statusText}
          </p>
        ) : null}
        {this.props.lobbyId ? (
          <p style={{ opacity: 0.45, fontSize: '9pt' }}>
            Lobby: {this.props.lobbyId}
          </p>
        ) : null}
        {this.props.onBack ? (
          <button className='Button' onClick={this.props.onBack.bind(this)}>
            Cancel
          </button>
        ) : null}
      </div>
    )
  }
}

export default LoadingScreen
