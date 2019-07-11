let Constants = require('./Constants')
let SpriteNode = require('./SpriteNode')

let InventorySmallCardDisplay = require('./InventorySmallCardDisplay')

module.exports = class InventoryDeckDisplay extends SpriteNode {
    constructor(gameView, game, maxCards, quantity) {
        super()

        this._gameView = gameView
        this._game = game
        this._name = ""
        this._maxCards = maxCards
        this.setQuantity(quantity)

        this.setPagingStr("1/1")
        this._cardsInDisplay = []

        this.setDrawOrder(Constants.DRAW_ORDER_DECK)
        this._gameView.addSpriteNode(this)
    }

    setName(name){
        this._name = name
    }
    
    setPagingStr(str) {
        this._pagingStr = str
    }

    setQuantity(quantity) {
        this._quantity = quantity
        this._maxCardstr = this._quantity + "/" + this._maxCards
    }

    addItem(card) {
        let addedItem = false
        if (this._quantity < this._maxCards) {
            let smallCard = null
            for (let i = 0; i < this._cardsInDisplay.length; ++i) {
                if (this._cardsInDisplay[i].getName() === card._type.Name) {
                    smallCard = this._cardsInDisplay[i]
                    break;
                }
            }

            if (smallCard == null) {
                let pos = this.getPosition()
                pos.y = 12.5 + (this._cardsInDisplay.length * 12.5)
                smallCard = new InventorySmallCardDisplay(this._gameView, this._game, card, card._type.Cost, card._type.Name, 1);
                smallCard.setDrawOrder(Constants.DRAW_ORDER_MOVING_CARD + this._quantity);
                smallCard.setEnabled(true)
                smallCard.setPosition(pos)
                pos.y = 5

                this._cardsInDisplay.push(smallCard)
            }
            else {
                smallCard.setQuantity(smallCard._quantity + 1)
            }
            this.setQuantity(this._quantity + 1)
            addedItem = true
        }
        return addedItem
    }

    removeItem(smallCard) {
        let removedItem = false
        if (smallCard._quantity === 1) {
            this._gameView.removeSpriteNode(smallCard)

            let index = this._cardsInDisplay.indexOf(smallCard)
            if (index > -1) this._cardsInDisplay.splice(index, 1)
            this._cardsInDisplay.filter(sn => sn !== smallCard)
            this.setQuantity(this._quantity - 1)
            removedItem = true
        }
        else if (smallCard._quantity > 1) {
            smallCard.setQuantity(smallCard._quantity - 1)
            this.setQuantity(this._quantity - 1)
            removedItem = true
        }

        return removedItem
    }

    render() {
        let pos = this.getPosition()

        this._gameView.drawText(
            { x: pos.x - this._name.length * 2, y: pos.y - 5 },
            this._name, Constants.ROCK_CARD_NUMBER_COLOR)

        this._gameView.drawText(
            { x: pos.x - this._maxCardstr.length * 2, y: pos.y + 230 },
            this._maxCardstr, Constants.ROCK_CARD_NUMBER_COLOR)

        this._gameView.drawText(
            { x: pos.x - 180.5 - this._pagingStr.length * 2, y: pos.y + 230 },
            this._pagingStr, Constants.ROCK_CARD_NUMBER_COLOR)
    }
}
