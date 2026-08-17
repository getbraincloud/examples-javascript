import React, { Component } from 'react'

// Must match a channel Code pre-registered in the portal (App > Design > Messaging >
// Chat Channels) — global ("gl") chat channels aren't created ad hoc by getChannelId,
// they resolve an existing registration or fail with CHAT_UNRECOGNIZED_CHANNEL (40603).
const CHAT_CHANNEL_TYPE = 'gl'
const CHAT_CHANNEL_SUB_ID = 'gl'
const MAX_HISTORY = 30
const RETRY_BACKOFF_MS = 5000

function parseWireMessage (m) {
  return {
    msgId: m.msgId || '',
    fromName: (m.from && m.from.name) || 'Player',
    text: (m.content && m.content.text) || ''
  }
}

// Shared app-wide "Global" chat channel — used from both the main menu and the lobby,
// so channel resolution / history / send all live here. brainCloud's chat calls all
// require RTT to be enabled (RTT_NOT_ENABLED otherwise); App.js enables RTT as soon as
// login succeeds, which covers both mount points. Live RTT push: channelConnect both
// registers the listener AND returns initial history in one call; every message after
// that (including our own sends, edits, and deletes) arrives via registerRTTChatCallback
// — see knowledge-articles/01-chat.md. No re-fetch after posting.
//
// Props:
//   bcWrapper — the app's BrainCloudWrapper instance
class GlobalChatPanel extends Component {
  constructor (props) {
    super(props)
    this.state = {
      channelId: null,
      resolving: false,
      messages: [],
      input: '',
      sending: false
    }
    this.retryAtMs = 0
    this.scrollRef = React.createRef()
    this.onRTTChatEvent = this.onRTTChatEvent.bind(this)
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

  componentWillUnmount () {
    if (this.state.channelId) {
      this.props.bcWrapper.rttService.deregisterRTTChatCallback()
    }
  }

  // Resolves the shared global channel once RTT is up, connects (which also returns
  // initial history in the same response), and registers for live push. Safe to call
  // on every update — no-ops once resolved, in flight, or backing off after a recent
  // failure (so a persistent failure can't turn into a same-call-every-render loop —
  // brainCloud's abuse detection disables the client after enough repeated failures
  // on one API call).
  ensureChannel () {
    const { bcWrapper } = this.props
    if (!bcWrapper || this.state.channelId || this.state.resolving) return
    if (!bcWrapper.rttService.isRTTEnabled()) return
    if (Date.now() < this.retryAtMs) return

    this.setState({ resolving: true })
    bcWrapper.chat.getChannelId(CHAT_CHANNEL_TYPE, CHAT_CHANNEL_SUB_ID, result => {
      if (result.status === 200 && result.data.channelId) {
        this.connectChannel(result.data.channelId)
      } else {
        this.retryAtMs = Date.now() + RETRY_BACKOFF_MS
        this.setState({ resolving: false })
      }
    })
  }

  connectChannel (channelId) {
    this.props.bcWrapper.chat.channelConnect(channelId, MAX_HISTORY, result => {
      if (result.status !== 200) {
        this.retryAtMs = Date.now() + RETRY_BACKOFF_MS
        this.setState({ resolving: false })
        return
      }
      // Server already returns these ascending/oldest-first (it re-sorts from its
      // native descending storage order before responding) — no reverse needed. Same
      // order as the RTT push appends, so history and live messages never conflict.
      const messages = result.data.messages.map(parseWireMessage)
      this.props.bcWrapper.rttService.registerRTTChatCallback(this.onRTTChatEvent)
      this.setState({ channelId, resolving: false, messages })
    })
  }

  // New messages, edits, and deletes all arrive on the same RTT event, keyed by msgId —
  // a message updated or deleted after it's scrolled out of the fetched window is simply
  // not found below and the event is a no-op, which is correct (nothing on screen to change).
  onRTTChatEvent (result) {
    const data = result.data || {}
    if (result.operation === 'INCOMING') {
      this.setState({ messages: this.state.messages.concat([parseWireMessage(data)]) })
    } else if (result.operation === 'UPDATE') {
      // Same shape as INCOMING (full message, edited content) — replace in place so it
      // doesn't jump to the bottom of the scroll.
      const updated = parseWireMessage(data)
      this.setState({
        messages: this.state.messages.map(m => (m.msgId === updated.msgId ? updated : m))
      })
    } else if (result.operation === 'DELETE') {
      // DELETE's payload is just {chId, msgId} -- no content/from -- so only msgId is usable here.
      this.setState({
        messages: this.state.messages.filter(m => m.msgId !== data.msgId)
      })
    }
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
    })
  }

  render () {
    const { channelId, resolving, messages, input } = this.state
    return (
      <div className='GlobalChatPanel'>
        {!channelId ? (
          <p className='text-small'>{resolving ? 'Connecting...' : 'Chat unavailable.'}</p>
        ) : (
          <>
            <div className='chatScroll' ref={this.scrollRef}>
              {messages.map((m, i) => (
                <p key={m.msgId || i} className='chatLine'>
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
