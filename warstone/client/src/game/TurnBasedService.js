// eslint-disable-next-line
if (typeof WebSocket === 'undefined')
{
    var WebSocket = require('isomorphic-ws');
}

module.exports = class TurnBasedService
{
    constructor(profileId, lobby, server,
                onNextTurnCallback,
                onDrawCallback,
                onVictoryCallback,
                onDefeatCallback,
                onCloseCallback)
    {
        this._profileId = profileId
        this._lobby = lobby
        this._socket = null
        this._server = server
        this._onNextTurnCallback = onNextTurnCallback
        this._onDrawCallback = onDrawCallback
        this._onVictoryCallback = onVictoryCallback
        this._onDefeatCallback = onDefeatCallback
        this._onCloseCallback = onCloseCallback

        // var uri = "ws://" + server.url + ":" + server.wsPort
        var uri = "ws://" + server.connectData.address + ":" + server.connectData.ports["9313/tcp"]
        this._socket = new WebSocket(uri)
        
        this._socket.addEventListener('error', this.onSocketError.bind(this))
        this._socket.addEventListener('close', this.onSocketClosed.bind(this))
        this._socket.addEventListener('open', this.onSocketOpen.bind(this))
        this._socket.addEventListener('message', this.onSocketMessage.bind(this))
    }

    onSocketError(e)
    {
        if (!this._socket) return;
        if (this._onCloseCallback) this._onCloseCallback({}, "Connection failed")
    }

    onSocketClosed(e)
    {
        if (!this._socket) return;
        if (this._onCloseCallback) this._onCloseCallback({}, "Connection closed")
    }

    onSocketOpen(e)
    {
        // Yay!
        console.log("WebSocket connection established");
        this.send("CONNECT", {passcode: this._server.passcode})
    }

    send(op, data)
    {
        this._socket.send(JSON.stringify({
                service: "TurnBased",
                op: op,
                profileId: this._profileId,
                lobbyId: this._server.lobbyId,
                data: data
            }
        ))
    }

    disconnect()
    {
        this._socket = null
    }

    onSocketMessage(e)
    {
        if (!this._socket) return;

        let msg = JSON.parse(e.data);
        console.log("RS RECV: " + e.data)
        if (!this.onRecv(msg.event, msg))
        {
            this.disconnect()
        }
    }

    submitTurn(data)
    {
        this.send("SUBMIT_TURN", data);
    }

    onRecv(event, jsonResponse)
    {
        switch (event)
        {
            case "GAME_STATE":
            {
                if (jsonResponse.close)
                {
                    this._onCloseCallback(jsonResponse.data, jsonResponse.close)
                    return false
                }
                else if (jsonResponse.winners)
                {
                    let winners = jsonResponse.winners
                    if (winners.length === 0)
                    {
                        this._onDrawCallback(jsonResponse.data)
                        return false
                    }
                    else
                    {
                        if (winners.find(id => id === this._profileId))
                        {
                            this._onVictoryCallback(jsonResponse.data, winners)
                            return false
                        }
                        this._onDefeatCallback(jsonResponse.data, winners)
                        return false
                    }
                }
                else
                {
                    let turnId = jsonResponse.turn
                    let user = this._lobby.members.find(member => member.profileId === turnId)
                    this._onNextTurnCallback(user, jsonResponse.data)
                }
                break
            }
            default:
                break
        }

        return true
    }
}
