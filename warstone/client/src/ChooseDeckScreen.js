import React, { Component } from 'react'
import './style.css'


// Props:
//  text
// app
//  onBack
class ChooseDeckScreen extends Component {
    constructor() {
        super()
        this._selectedDeck = null
        this._displayDecks = []
    }

    componentDidMount() {
        this.onFetchDeckInfo()
    }

    componentWillUnmount() {
        this._displayDecks = []
    }

    onBack() {
        this.props.onBack()
    }

    onPlayGame() {
        this.props.onPlayGame()
    }

    onDeleteDeck() {
        this.props.onDeleteDeck()
    }

    onEditDeck() {
        this.props.onEditDeck()
    }

    onNewDeck() {
        this.props.onNewDeck()
    }

    onDeckSelected(selection) {
        console.log(" " + this._displayDecks[selection])
        this._selectedDeck = selection
    }

    onFetchDeckInfo() {
        this.props.app.bc.script.runScript("getUserDeck", {}, result => {
            this._displayDecks = Object.values(result.data.response.decks)
        })
    }

    render() {
        var buttonArea = <button id="btn-red-card" onClick={this.onDeckSelected.bind(this, 0)}>{this._displayDecks.length}</button>
        for (let i = 0; i < this._displayDecks.length; ++i) {
            buttonArea = <button id="btn-red-card" onClick={this.onDeckSelected.bind(this, 0)}>{this._displayDecks.length}</button>
        }
        return (
            <div className="ChooseDeckScreen">
                <p>MY DECKS</p>
                <div id="cd-titleBar">
                    <button id="btn-blue" onClick={this.onBack.bind(this)}>BACK</button>
                    <div className="btn-frame">
                        <p className="text-small">Choose your deck below.</p>
                    </div>
                    <button id="btn-green" onClick={this.onNewDeck.bind(this)}>NEW DECK</button>
                </div>
                <div id="login-area">
                    <div id="field-area">
                        {buttonArea}
                    </div>
                    <small>Page 1 / 1</small>
                </div>
                <div>
                    <button id="btn-red" onClick={this.onDeleteDeck.bind(this)}>DELETE DECK</button>
                    <button id="btn-blue" onClick={this.onEditDeck.bind(this)}>EDIT DECK</button>
                    <button id="btn-green" onClick={this.onPlayGame.bind(this)}>PLAY GAME</button>
                </div>
            </div >
        )
    }
}

export default ChooseDeckScreen;
