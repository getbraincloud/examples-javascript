let Constants = require('./Constants')
let Resources = require('./Resources')
let Sprite = require('./Sprite')
let SpriteNode = require('./SpriteNode')

module.exports = class InventorySmallCardDisplay extends SpriteNode {
    constructor(gameView, game, card, energyCost, name, quantity) {
        super()

        this._gameView = gameView
        this._game = game
        this._energyCost = energyCost
        this._energyCostStr = this._energyCost + ""
        this._name = name
        this._card = card

        this.setSprite(Resources._sprite_energyBg)
        this.setQuantity(quantity)
        this._gameView.addSpriteNode(this)
        this.setEnabled(true)
    }

    getName() {
        return this._name
    }

    setQuantity(quantity) {
        this._quantity = quantity
        this._quantityStr = quantity > 1 ? "x" + quantity : ""
    }

    onClicked() {
        this._game.onSmallCardClicked(this, this._card)
    }

    render() {
        let pos = this.getPosition()
        Sprite.renderPos(Resources._sprite_energyBg, pos)
        this.drawText()
    }

    renderHover() {
        let pos = this.getPosition()
        Sprite.renderPos(Resources._sprite_energyBg, pos)
        this.drawText()
    }

    renderDown() {
        let pos = this.getPosition()
        Sprite.renderPos(Resources._sprite_energyBg, pos)
        this.drawText()
    }

    drawText() {
        let pos = this.getPosition()
        this._gameView.drawText(
            { x: pos.x + 7.5 - this._energyCostStr.length * 2, y: pos.y + 5 },
            this._energyCostStr, Constants.CARD_NUMBER_COLOR)

        this._gameView.drawText(
            { x: pos.x + 25 - this._name.length * 2, y: pos.y + 5 },
            this._name, Constants.ROCK_CARD_NUMBER_COLOR)

        this._gameView.drawText(
            { x: pos.x + 50 - this._quantityStr.length * 2, y: pos.y + 5 },
            this._quantityStr, Constants.ROCK_CARD_NUMBER_COLOR)
    }
}
