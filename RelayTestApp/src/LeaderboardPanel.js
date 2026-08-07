import React, { Component } from 'react'

// Must match leaderboards configured on the app (Design > Leaderboards) — these are
// the same default ids leaderboardPanel.cpp posts to and reads from.
export const LEADERBOARD_IDS = {
  points: { lifetime: 'CursorParty_Points', quarterly: 'CursorParty_Points_Quarterly' },
  coverage: { lifetime: 'CursorParty_HighestCoverage', quarterly: 'CursorParty_HighestCoverage_Quarterly' }
}

// Gold/silver/bronze/white — shared with the lobby member list's rank display.
export function rankColor (rank) {
  if (rank === 1) return '#ffd700'
  if (rank === 2) return '#c0c0c0'
  if (rank === 3) return '#cc8833'
  return '#ffffff'
}

// The coverage board's raw score is basis points (coveragePct*100, since brainCloud
// leaderboard scores are integers) — divide back down for display. The points board's
// raw score is already the real value.
function formatScore (score, boardType) {
  if (boardType === 'coverage') return `${(score / 100).toFixed(1)}%`
  return String(score).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// Shared leaderboard viewer — top 5 + "you" row, toggleable between the two boards this
// app posts to (points / coverage) and Lifetime vs Quarterly. Mirrors leaderboardPanel.cpp.
//
// NOTE: scores are only posted once a match's coverage/win-ranking is computed and
// submitted (BCLOUD-14472/14490, still landing on cpp) — until some client posts to
// these boards, they'll show "No scores yet."
//
// Props:
//   bcWrapper
class LeaderboardPanel extends Component {
  constructor (props) {
    super(props)
    this.state = {
      boardType: 'points', // 'points' | 'coverage'
      period: 'lifetime', // 'lifetime' | 'quarterly'
      resultsByKey: {} // "<boardType>:<period>" -> { top: [...], self: {...}|null }
    }
    this.pendingKeys = new Set()
  }

  componentDidMount () {
    this.fetchIfNeeded()
  }

  componentDidUpdate () {
    this.fetchIfNeeded()
  }

  currentKey () {
    return `${this.state.boardType}:${this.state.period}`
  }

  parseEntry (entry) {
    return {
      name: (entry.data && entry.data.name) || 'Player',
      score: entry.score,
      rank: entry.rank
    }
  }

  fetchIfNeeded () {
    const { bcWrapper } = this.props
    const key = this.currentKey()
    if (!bcWrapper || this.state.resultsByKey[key] || this.pendingKeys.has(key)) return
    this.pendingKeys.add(key)

    const leaderboardId = LEADERBOARD_IDS[this.state.boardType][this.state.period]
    const HIGH_TO_LOW = bcWrapper.socialLeaderboard.sortOrder.HIGH_TO_LOW

    const mergeResult = (partial) => {
      this.setState(prev => ({
        resultsByKey: {
          ...prev.resultsByKey,
          [key]: { top: [], self: null, ...prev.resultsByKey[key], ...partial }
        }
      }))
    }

    bcWrapper.socialLeaderboard.getGlobalLeaderboardPage(leaderboardId, HIGH_TO_LOW, 0, 4, result => {
      mergeResult({ top: result.status === 200 ? (result.data.leaderboard || []).map(this.parseEntry) : [] })
    })

    // beforeCount=0/afterCount=0 returns just the current player's own entry.
    bcWrapper.socialLeaderboard.getGlobalLeaderboardView(leaderboardId, HIGH_TO_LOW, 0, 0, result => {
      const entries = result.status === 200 ? result.data.leaderboard : []
      mergeResult({ self: entries && entries.length > 0 ? this.parseEntry(entries[0]) : null })
    })
  }

  setBoardType (boardType) {
    this.setState({ boardType })
  }

  setPeriod (period) {
    this.setState({ period })
  }

  render () {
    const { boardType, period } = this.state
    const { top, self } = this.state.resultsByKey[this.currentKey()] || { top: [], self: null }
    const alreadyShown = self && top.some(row => row.rank === self.rank)

    return (
      <div className='LeaderboardPanel'>
        <div className='lbToggleRow'>
          <button
            className={`lbToggleBtn${boardType === 'points' ? ' active' : ''}`}
            onClick={this.setBoardType.bind(this, 'points')}
          >Most Opponents Beaten</button>
          <button
            className={`lbToggleBtn${boardType === 'coverage' ? ' active' : ''}`}
            onClick={this.setBoardType.bind(this, 'coverage')}
          >Highest Coverage %</button>
        </div>
        <div className='lbToggleRow'>
          <button
            className={`lbToggleBtn lbPeriodBtn${period === 'lifetime' ? ' active' : ''}`}
            onClick={this.setPeriod.bind(this, 'lifetime')}
          >Lifetime</button>
          <button
            className={`lbToggleBtn lbPeriodBtn${period === 'quarterly' ? ' active' : ''}`}
            onClick={this.setPeriod.bind(this, 'quarterly')}
          >Quarterly</button>
        </div>
        <hr className='lbDivider' />
        {top.length === 0 ? (
          <p className='text-small'>No scores yet — be the first!</p>
        ) : (
          top.map((row, i) => (
            <div key={i} className='lbRow'>
              <span className='lbRank' style={{ color: rankColor(row.rank) }}>#{row.rank}</span>
              <span className='lbName'>{row.name}</span>
              <span className='lbScore'>{formatScore(row.score, boardType)}</span>
            </div>
          ))
        )}
        {self && !alreadyShown ? (
          <>
            {top.length > 0 ? <p className='text-small lbEllipsis'>...</p> : null}
            <div className='lbRow lbSelfRow'>
              <span className='lbRank' style={{ color: rankColor(self.rank) }}>#{self.rank}</span>
              <span className='lbName'>{self.name} (You)</span>
              <span className='lbScore'>{formatScore(self.score, boardType)}</span>
            </div>
          </>
        ) : null}
      </div>
    )
  }
}

export default LeaderboardPanel
