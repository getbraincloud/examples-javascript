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
    }

    componentDidMount() {
        this.initialize()
    }

    componentWillUnmount()
    {
        if (this._intervaleId)
        {
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

    onBack() {
        this.props.onBack()
    }


    onFetchItemCatalog() {
        this.props.app.bc.script.runScript("getItemCatalog", {}, result => {
            this._itemCatalog = result.data.response

            // all the catalog items
            let xOffset = Resources._sprite_redCardBack.width + 10 + Constants.TOP_DECK_POS.x
            let yOffset = (Resources._sprite_redCardBack.height / 2) - 12.5 + Constants.TOP_DECK_POS.y

            // placeholder for the catalog missing cards
            let numItems = 0
            let x = 0
            let y = 0
            while (numItems <= Object.keys(this._itemCatalog).length && numItems < 18)
            {
                this._inventoryView.addSpriteNode(new SpriteNode(Resources._sprite_redCardBack,
                    {
                        x: 20 + (xOffset * x),
                        y: yOffset * y
                    },
                    Constants.DRAW_ORDER_BACKGROUND + numItems))
                    
                ++x
                ++numItems
                if (numItems % 6 === 0)
                {
                    ++y
                    x = 0
                }
            }
        })
    }

    onFetchUserInventory(){
        this.props.app.bc.script.runScript("getItemCatalog", {}, result => {
            //
            let deck = result.data.response

            let values = Object.keys(deck)
            
            let xOffset = Resources._sprite_redCardBack.width + 10 + Constants.TOP_DECK_POS.x
            let yOffset = (Resources._sprite_redCardBack.height / 2) - 12.5 + Constants.TOP_DECK_POS.y

            let numItems = 0
            let x = 0
            let y = 0
            
            for (let i = 0; i < values.length && numItems < 18; ++i)
            {
                let card = new Card(i, this._itemCatalog[values[i]], true, null, null, this._inventoryView, null, null, null)
                card.setDrawOrder(Constants.DRAW_ORDER_BOARD + i)
                card.setPosition({
                    x: 20 + (xOffset * x),
                    y: yOffset * y
                })

                ++x
                ++numItems
                if (numItems % 6 === 0)
                {
                    ++y
                    x = 0
                }
                card._backFaced = false
                this._inventoryView.addSpriteNode(card)
                this._cards.push(card)
            }
        })
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

    initialize() {
        Renderer.initialize(this.refs.glCanvas)
        this._itemCatalog = null
        this._cards = []
        this._inventoryView = new InventoryView()
        //this._inventoryView.onClicked = this.onBack.bind(this)

        this.onFetchItemCatalog()
        this.onFetchUserInventory()

        // Back Button
        this._backButton = new AdvanceButton(this._inventoryView, "BACK", 200, { x: 0, y: 200 })
        this._backButton.onClicked = this.onBack.bind(this)
        this._backButton.setEnabled(true)
        this._inventoryView.addSpriteNode(this._backButton)

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
