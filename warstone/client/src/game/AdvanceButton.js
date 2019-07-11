let Constants = require('./Constants')
let Resources = require('./Resources')
let SpriteNode = require('./SpriteNode')
let Sprite = require('./Sprite')

module.exports = class AdvanceButton extends SpriteNode {
    constructor(_gameView, title, drawOrder, pos) {
        super()

        this._gameView = _gameView
        this._title = title
        this.setSprite(Resources._sprite_playerUp)
        this.setDrawOrder(drawOrder)
        this.setPosition(pos)
        _gameView.addSpriteNode(this);
    }

    render() {
        Sprite.renderPos(Resources._sprite_playerUp, this.getPosition())
        this.drawTitle(Constants.CARD_TEXT_COLOR)
    }

    renderHover() {
        Sprite.renderPos(Resources._sprite_playerHover, this.getPosition())
        this.drawTitle(Constants.CARD_HOVER_COLOR)
    }

    renderDown() {
        Sprite.renderPos(Resources._sprite_playerDown, this.getPosition())
        this.drawTitle(Constants.CARD_TEXT_COLOR)
    }

    renderDisabled() {
        // When the advanced button is disabled, we don't show it
        //TODO: John wants it to look disabled
    }

    drawTitle(color) {
        let pos = { ...this.getPosition() }
        pos.x += Resources._sprite_playerUp.width / 2
        pos.y += Resources._sprite_playerUp.height / 2
        pos.y -= 14
        this._gameView.drawText(
            { x: pos.x - this._title.length * 2, y: pos.y },
            this._title, color)
    }

    onClicked() {
        this.props.onClicked();
    }
}
