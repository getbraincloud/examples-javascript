import React, { Component } from 'react'

// Must match a channel Code pre-registered in the portal (App > Design > Messaging >
// Chat Channels) — global ("gl") chat channels aren't created ad hoc by getChannelId,
// they resolve an existing registration or fail with CHAT_UNRECOGNIZED_CHANNEL (40603).
const CHAT_CHANNEL_TYPE = 'gl'
const CHAT_CHANNEL_SUB_ID = 'gl'
const MAX_HISTORY = 30
const RETRY_BACKOFF_MS = 5000

// Shared app-wide "Global" chat channel — used from both the main menu and the lobby,
// so channel resolution / history / send all live here. brainCloud's chat calls all
// require RTT to be enabled (RTT_NOT_ENABLED otherwise); App.js enables RTT as soon as
// login succeeds, which covers both mount points. Poll-based (explicit fetch after
// send / once resolved), not a live RTT push.
//
// Props:
//   bcWrapper — the app's BrainCloudWrapper instance
class GlobalChatPanel extends Component {
  constructor (props) {
    super(props)
    this.state = {
      channelId: null,
      resolving: false,
      fetchedOnce: false,
      messages: [],
      input: '',
      sending: false
    }
    this.retryAtMs = 0
    this.scrollRef = React.createRef()
  }

  componentDidMount () {
    this.ensureChannel()
  }

  componentDidUpdate (prevProps, prevState) {
    this.ensureChannel()
    if (this.state.messages.length !== prevState.messages.length) {
      const el = this.scrollRef.current
      if (el) el.scrollTop = el.scrollHeight
    }
  }

  // Resolves the shared global channel once RTT is up, then fetches history. Safe to
  // call on every update — no-ops once resolved, in flight, or backing off after a
  // recent failure (so a persistent failure can't turn into a same-call-every-render
  // loop — brainCloud's abuse detection disables the client after enough repeated
  // failures on one API call).
  ensureChannel () {
    const { bcWrapper } = this.props
    if (!bcWrapper || this.state.channelId || this.state.resolving) return
    if (!bcWrapper.rttService.isRTTEnabled()) return
    if (Date.now() < this.retryAtMs) return

    this.setState({ resolving: true })
    bcWrapper.chat.getChannelId(CHAT_CHANNEL_TYPE, CHAT_CHANNEL_SUB_ID, result => {
      if (result.status === 200 && result.data.channelId) {
        const channelId = result.data.channelId
        this.setState({ channelId, resolving: false })
        this.fetchMessages(channelId)
      } else {
        this.retryAtMs = Date.now() + RETRY_BACKOFF_MS
        this.setState({ resolving: false })
      }
    })
  }

  fetchMessages (channelId) {
    this.props.bcWrapper.chat.getRecentChatMessages(channelId, MAX_HISTORY, result => {
      this.setState({ fetchedOnce: true })
      if (result.status === 200) {
        // Server returns newest-first; flip to oldest-first for natural top-to-bottom
        // reading order.
        const messages = result.data.messages.slice().reverse().map(m => ({
          fromName: (m.from && m.from.name) || 'Player',
          text: (m.content && m.content.text) || ''
        }))
        this.setState({ messages })
      }
    })
  }

  onInputChange (e) {
    this.setState({ input: e.target.value })
  }

  onKeyDown (e) {
    if (e.key === 'Enter') this.send()
  }

  send () {
    const { channelId, input, sending } = this.state
    if (!channelId || !input.trim() || sending) return
    this.setState({ input: '', sending: true })
    this.props.bcWrapper.chat.postChatMessageSimple(channelId, input, true, () => {
      this.setState({ sending: false })
      this.fetchMessages(channelId)
    })
  }

  render () {
    const { channelId, resolving, fetchedOnce, messages, input } = this.state
    return (
      <div className='GlobalChatPanel'>
        {!channelId ? (
          <p className='text-small'>{resolving || !fetchedOnce ? 'Connecting...' : 'Chat unavailable.'}</p>
        ) : (
          <>
            <div className='chatScroll' ref={this.scrollRef}>
              {messages.map((m, i) => (
                <p key={i} className='chatLine'>
                  <span className='chatFrom'>{m.fromName}:</span> {m.text}
                </p>
              ))}
            </div>
            <div className='chatInputRow'>
              <input
                type='text'
                value={input}
                onChange={this.onInputChange.bind(this)}
                onKeyDown={this.onKeyDown.bind(this)}
                placeholder='Say something...'
              />
              <button className='Button chatSendBtn' onClick={this.send.bind(this)}>Send</button>
            </div>
          </>
        )}
      </div>
    )
  }
}

export default GlobalChatPanel
