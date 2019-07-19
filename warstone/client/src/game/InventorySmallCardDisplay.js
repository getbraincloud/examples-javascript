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
        this.set9Slice(Constants.DIALOG_SIZE, Constants.DIALOG_PADDING)
        this.setQuantity(quantity)
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
        Sprite.render9Slice(Resources._sprite_energyBg, pos, Constants.SMALL_CARD_SIZE, Constants.SMALL_CARD_PADDING)
        this.drawText(false)
    }

    renderHover() {
        let pos = this.getPosition()
        Sprite.render9Slice(Resources._sprite_energyBg, pos, Constants.SMALL_CARD_SIZE, Constants.SMALL_CARD_PADDING)
        this.drawText(true)
    }

    renderDown() {
        let pos = this.getPosition()
        Sprite.render9Slice(Resources._sprite_energyBg, pos, Constants.SMALL_CARD_SIZE, Constants.SMALL_CARD_PADDING)
        this.drawText(false)
    }

    drawText(isHover) {
        let pos = this.getPosition()
        this._gameView.drawText(
            { x: pos.x + 7.5 - this._energyCostStr.length * 2, y: pos.y + 5 },
            this._energyCostStr, Constants.CARD_NUMBER_COLOR)

        this._gameView.drawText(
            { x: pos.x + 40 - this._name.length * 2, y: pos.y + 5 },
            this._name, isHover ? Constants.CARD_NUMBER_COLOR : Constants.ROCK_CARD_NUMBER_COLOR)

        this._gameView.drawText(
            { x: pos.x + 80 - this._quantityStr.length * 2, y: pos.y + 5 },
            this._quantityStr, isHover ? Constants.CARD_NUMBER_COLOR : Constants.ROCK_CARD_NUMBER_COLOR)
    }
}
