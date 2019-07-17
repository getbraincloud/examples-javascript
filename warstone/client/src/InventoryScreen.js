import React, { Component } from 'react'
import './InventoryScreen.css'

let Card = require("./game/Card")
let Constants = require("./game/Constants")
let AdvanceButton = require("./game/AdvanceButton")
let Renderer = require("./game/Renderer")
let Resources = require('./game/Resources')
let SpriteNode = require('./game/SpriteNode')
let Input = require("./game/Input")
let InventoryView = require("./game/InventoryView")
let InventoryDeckDisplay = require('./game/InventoryDeckDisplay')

let FRAME_RATE = 60

// Props:
//  text
// app
//  onBack
class InventoryScreen extends Component {
    constructor() {
        super()

        this._intervaleId = null    // Update/Render main loop logic
        this._inventoryView = null

        // Extra UI stuff
        this._backButton = null
        this._downPage = null
        this._upPage = null
        this._pagingDisplayStr = "1/1"
    }

    componentDidMount() {
        this.initialize()
    }

    componentWillUnmount() {
        if (this._intervaleId) {
            clearInterval(this._intervaleId)
        }
    }

    mainLoop() {
        let dt = 1 / FRAME_RATE

        if (this._inventoryView) {
            this._inventoryView.update(dt)
        }

        this._cards.forEach(card => card.update(dt))

        if (this._inventoryView) {
            this._inventoryView.renderView()
        }
    }

    maxCatalogPages() {
        return this._itemCatalog != null ?
            Math.ceil(Object.keys(this._itemCatalog).length / Constants.NUM_ITEMS_PER_INVENTORY_PAGE) - 1 :
            0
    }

    onPageDown() {
        // do we want this to cycle ?
        if (this._pageIndex > 0)--this._pageIndex
        this.refreshUserCardDisplay()
        this.refreshPageIndexDisplay()
    }

    onPageUp() {
        // do we want this to cycle ?
        if (this._pageIndex < this.maxCatalogPages())++this._pageIndex
        this.refreshUserCardDisplay()
        this.refreshPageIndexDisplay()
    }

    onCardClicked(clickedCard) {
        if (clickedCard._quantity > 0 && this._deckDisplay.addItem(clickedCard)) {
            clickedCard._quantity -= 1
        }
    }

    onSmallCardClicked(smallCard, associatedCard) {
        if (this._deckDisplay.removeItem(smallCard)) {
            associatedCard._quantity += 1
        }
    }

    onBack() {
        this.props.onBack()
    }

    refreshPlaceholderDisplay() {
        // all the catalog items
        let xOffset = Constants.INVENTORY_X_OFFSET
        let yOffset = Constants.INVENTORY_Y_OFFSET

        // placeholder for the catalog missing cards
        let x = 0
        let y = 0
        for (let i = this._pageIndex * Constants.NUM_ITEMS_PER_INVENTORY_PAGE;
            i < (this._pageIndex + 1) * Constants.NUM_ITEMS_PER_INVENTORY_PAGE;) {
            this._inventoryView.addSpriteNode(new SpriteNode(Resources._sprite_redCardBack,
                {
                    x: (xOffset * x),
                    y: Constants.INVENTORY_Y_HUD_OFFSET + yOffset * y
                },
                Constants.DRAW_ORDER_BACKGROUND + i))

            ++x
            ++i
            if (i % Constants.NUM_ITEMS_PER_COL === 0) {
                ++y
                x = 0
            }
        }
    }

    refreshUserCardDisplay() {
        for (let i = 0; i < this._cards.length; ++i) {
            this._inventoryView.removeSpriteNode(this._cards[i])
        }

        let xOffset = Constants.INVENTORY_X_OFFSET
        let yOffset = Constants.INVENTORY_Y_OFFSET

        let x = 0
        let y = 0

        for (let i = this._pageIndex * Constants.NUM_ITEMS_PER_INVENTORY_PAGE;
            i < this._cards.length &&
            i < (this._pageIndex + 1) * Constants.NUM_ITEMS_PER_INVENTORY_PAGE &&
            i < Object.keys(this._itemCatalog).length;) {

            let card = this._cards[i]

            card._backFaced = false
            card._state = Constants.CardState.INVENTORY_DISPLAY
            card.setEnabled(true)
            card.setDrawOrder(Constants.DRAW_ORDER_BOARD + i)
            card.setPosition({
                x: (xOffset * x),
                y: Constants.INVENTORY_Y_HUD_OFFSET + yOffset * y
            })

            ++x
            ++i
            if (i % Constants.NUM_ITEMS_PER_COL === 0) {
                ++y
                x = 0
            }

            this._inventoryView.addSpriteNode(card)
        }
    }

    onFetchItemCatalog() {
        this.props.app.bc.script.runScript("getItemCatalog_test", {
            "context": {
                "pagination": {
                    "rowsPerPage": 50,
                    "pageNumber": 1
                },
                "searchCriteria": {
                },
                "sortCriteria": {
                    "createdAt": 1,
                    "updatedAt": -1
                }
            }
        }, result => {
            this._itemCatalog = result.data.response.items
            this.refreshPlaceholderDisplay()
            this.refreshPageIndexDisplay()
        })
    }

    onFetchUserInventory() {
        this.props.app.bc.script.runScript("getUserInventory",{}, result => {
            this._deck = result.data.response
            this._deckDisplay.setName(this._deck.Name)
            let deckKeys = Object.keys(this._deck.Deck)
            let deckValues = Object.values(this._deck.Deck)
            let catalogKeys = Object.keys(this._itemCatalog)
            
            for (let i = 0; i < deckKeys.length && i < catalogKeys.length; ++i) {
                let card = new Card(i, this._itemCatalog[deckKeys[i]], true, null, null, this._inventoryView, this, null, null)
                card._quantity = deckValues[i]
                this._cards.push(card)
            }

            this.refreshUserCardDisplay()
        })
    }

    refreshPageIndexDisplay() {
        this._deckDisplay.setPagingStr((this._pageIndex + 1) + "/" + (this.maxCatalogPages() + 1))
    }

    onMouseMove(e) {
        Input.mousePos.x = Math.floor(e.nativeEvent.offsetX / Constants.SCALE)
        Input.mousePos.y = Math.floor(e.nativeEvent.offsetY / Constants.SCALE)
    }

    onMouseDown(e) {
        Input.mouseDown = true
    }

    onMouseUp(e) {
        Input.mouseDown = false
    }

    makeButton(text, pos) {
        let button = new AdvanceButton(this._inventoryView, text, 200, pos)
        button.setEnabled(true)
        this._inventoryView.addSpriteNode(button)
        return button
    }

    initialize() {
        Renderer.initialize(this.refs.glCanvas)
        this._itemCatalog = null
        this._pageIndex = 0
        this._cards = []
        this._inventoryView = new InventoryView()
        this._deckDisplay = new InventoryDeckDisplay(this._inventoryView, this, 30, 0)

        this._deckDisplay.setPosition({ x: 250, y: 5 })
        //this._inventoryView.onClicked = this.onBack.bind(this)

        this.onFetchItemCatalog()
        this.onFetchUserInventory()

        // Back Button
        this._backButton = this.makeButton("BACK", { x: 0, y: Constants.INVENTORY_BUTTON_Y })
        this._backButton.onClicked = this.onBack.bind(this)

        // _downPage
        this._downPage = this.makeButton("DOWN", { x: 85, y: Constants.INVENTORY_BUTTON_Y })
        this._downPage.onClicked = this.onPageUp.bind(this)

        // _upPage
        this._upPage = this.makeButton("UP", { x: 140, y: Constants.INVENTORY_BUTTON_Y })
        this._upPage.onClicked = this.onPageDown.bind(this)

        // Start the main loop
        this._intervaleId = setInterval(this.mainLoop.bind(this), 1000 / FRAME_RATE)
    }

    render() {
        return (
            <div className="InventoryScreen">
                <p>{this.props.text}</p>
                <canvas ref="glCanvas"
                    onMouseDown={this.onMouseDown.bind(this)}
                    onMouseUp={this.onMouseUp.bind(this)}
                    onMouseMove={this.onMouseMove.bind(this)}
                    width={Constants.WIDTH * Constants.SCALE}
                    height={Constants.HEIGHT * Constants.SCALE} />

            </div>
        )
    }
}

export default InventoryScreen;
