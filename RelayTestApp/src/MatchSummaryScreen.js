import React, { Component } from 'react'
import { rankColor } from './LeaderboardPanel'

let colors = require('./Colors').colors

const MATCH_SUMMARY_REMATCH_MS = 45000

// How long a player card waits for its "lb_result" leaderboard delta before giving up and
// showing "Leaderboard unavailable" instead of spinning forever (the cloud script
// call/broadcast is best-effort).
const LEADERBOARD_RESULT_TIMEOUT_MS = 8000

// Builds the "Lifetime #before->#after | Quarterly #before->#after" tail, omitting any
// period that didn't improve.
function periodsText (lifetime, quarterly) {
  const parts = []
  if (lifetime.improved) parts.push(`Lifetime #${lifetime.rankBefore < 0 ? '-' : lifetime.rankBefore} -> #${lifetime.rankAfter}`)
  if (quarterly.improved) parts.push(`Quarterly #${quarterly.rankBefore < 0 ? '-' : quarterly.rankBefore} -> #${quarterly.rankAfter}`)
  return parts.join('   |   ')
}

const EMPTY_DELTA = { ready: false, pointsLifetime: {}, pointsQuarterly: {}, coverageLifetime: {}, coverageQuarterly: {} }

// Post-match results + rematch-queue screen (BCLOUD-14489). Shows placements and rank
// deltas, then auto-rematches after MATCH_SUMMARY_REMATCH_MS or once everyone queues up
// (see App.tickRematchGate).
//
// Props:
//   user, lobby, matchResult ({valid, round, entries}), matchSummaryArrivalTime
//   onSetRematchReady(ready) / onMainMenu()
class MatchSummaryScreen extends Component {
  componentDidMount () {
    // Live-updates the countdown and drives this player's own auto-queue timeout.
    this.tickInterval = setInterval(() => this.tick(), 1000)
  }

  componentWillUnmount () {
    clearInterval(this.tickInterval)
  }

  tick () {
    // Per-player auto-queue: if this player hasn't clicked "Queue for Rematch" themselves
    // by MATCH_SUMMARY_REMATCH_MS, queue them automatically — matches the "if players do
    // nothing, auto rematch" requirement without waiting on anyone else.
    if (!this.props.user.isReady) {
      const elapsedMs = Date.now() - (this.props.matchSummaryArrivalTime || Date.now())
      if (elapsedMs >= MATCH_SUMMARY_REMATCH_MS) {
        this.props.onSetRematchReady(true)
        return
      }
    }
    this.forceUpdate()
  }

  renderPlayerCard (entry) {
    const member = this.props.lobby.members.find(m => m.cxId === entry.cxId)
    const name = member ? member.name : '?'
    const colorIndex = (member && member.extra) ? member.extra.colorIndex : 0
    const isMe = entry.cxId === this.props.user.cxId
    const delta = entry.lbDelta || EMPTY_DELTA

    const anyPointsUp = delta.ready && (delta.pointsLifetime.improved || delta.pointsQuarterly.improved)
    const anyCoverageBest = delta.ready && (delta.coverageLifetime.improved || delta.coverageQuarterly.improved)

    return (
      <div key={entry.cxId} className={`SummaryCard${isMe ? ' SummaryCardMe' : ''}`}>
        <div className='SummaryCardHeader'>
          <span style={{ color: rankColor(entry.rank) }}>#{entry.rank}</span>
          <span className='SummaryColorDot' style={{ backgroundColor: colors[colorIndex % colors.length] }} />
          <span className='SummaryName' style={{ color: isMe ? '#59ff73' : 'white' }}>{name}</span>
          {isMe ? <span className='text-small' style={{ opacity: 0.6 }}>(YOU)</span> : null}
          <span className='SummaryCoverageBlock'>
            <span style={{ color: isMe ? '#59ff73' : 'white', fontWeight: 'bold' }}>{entry.coveragePct.toFixed(0)}%</span>
            <span className='text-small' style={{ opacity: 0.6 }}>COVERAGE</span>
          </span>
        </div>

        <div className='SummaryBadgeRow'>
          <span className='SummaryPill'>+{entry.beaten + 1} pts</span>
          <span className='text-small' style={{ opacity: 0.6, marginLeft: '8px' }}>{entry.beaten} beaten + 1 for playing</span>
        </div>

        {!delta.ready ? (
          <p className='text-small' style={{ opacity: 0.6 }}>
            {Date.now() - (this.props.matchSummaryArrivalTime || Date.now()) >= LEADERBOARD_RESULT_TIMEOUT_MS
              ? 'Leaderboard unavailable'
              : 'Updating leaderboards...'}
          </p>
        ) : (
          <>
            {anyPointsUp ? (
              <div className='SummaryPill SummaryPillGood'>^ Rank up - Opponents Beaten   {periodsText(delta.pointsLifetime, delta.pointsQuarterly)}</div>
            ) : null}
            {anyCoverageBest ? (
              <div className='SummaryPill SummaryPillBest'>* Personal best - Coverage %   {periodsText(delta.coverageLifetime, delta.coverageQuarterly)}</div>
            ) : null}
            {!anyPointsUp && !anyCoverageBest ? (
              <p className='text-small' style={{ opacity: 0.5 }}>No leaderboard rank change this round</p>
            ) : null}
          </>
        )}
      </div>
    )
  }

  render () {
    const entries = this.props.matchResult.entries || []
    const winner = entries.length > 0 ? entries[0] : null
    const winnerMember = winner ? this.props.lobby.members.find(m => m.cxId === winner.cxId) : null

    const elapsedMs = Date.now() - (this.props.matchSummaryArrivalTime || Date.now())
    const remainingSec = Math.max(0, Math.ceil((MATCH_SUMMARY_REMATCH_MS - elapsedMs) / 1000))
    const mm = Math.floor(remainingSec / 60)
    const ss = String(remainingSec % 60).padStart(2, '0')

    // Your own row uses the immediate local isReady, not the lobby snapshot — the snapshot
    // for your own entry is briefly stale right after arriving here (App.js clears it
    // optimistically the moment END_MATCH lands, but the server echo confirming that on
    // lobby.members can take a few seconds), which used to show e.g. "1/1" for a few
    // seconds before dropping to the correct "0/1".
    const readyCount = this.props.lobby.members.filter(m =>
      m.cxId === this.props.user.cxId ? this.props.user.isReady : m.isReady
    ).length
    const iAmReady = this.props.user.isReady

    return (
      <div className='MatchSummaryScreen'>
        <div className='Card SummaryPanel'>
          <h2 style={{ margin: '0 0 2px' }}>Match Summary</h2>
          <p className='text-small' style={{ opacity: 0.6, margin: '0 0 8px' }}>
            Lobby {this.props.lobby.lobbyId} - {this.props.lobby.members.length} Players
          </p>

          {winner ? (
            <div className='SummaryWinnerBanner'>
              {(winnerMember ? winnerMember.name : '?')} wins the round, covering {winner.coveragePct.toFixed(0)}% of the board.
            </div>
          ) : (
            <p className='text-small' style={{ opacity: 0.7 }}>Waiting for results...</p>
          )}

          <div className='SummaryHeaderRow'>
            <span className='text-small' style={{ opacity: 0.6 }}>RANK / PLAYER</span>
            <span className='text-small' style={{ opacity: 0.6 }}>LEADERBOARD RESULT</span>
          </div>
          <hr className='lbDivider' />

          <div className='SummaryScroll'>
            {entries.map(entry => this.renderPlayerCard(entry))}
          </div>

          <hr className='lbDivider' />
          <p className='text-small' style={{ opacity: 0.6, margin: '4px 0' }}>Next Round: {mm}:{ss}</p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              className={`Button${iAmReady ? ' ButtonPrimary' : ''}`}
              onClick={() => this.props.onSetRematchReady(!iAmReady)}
            >
              {iAmReady ? 'Queued for Rematch' : 'Queue for Rematch'} {readyCount}/{this.props.lobby.members.length}
            </button>
            <button className='Button' onClick={this.props.onMainMenu}>Main Menu</button>
          </div>
        </div>
      </div>
    )
  }
}

export default MatchSummaryScreen
