// Screen resolution
exports.WIDTH = 320
exports.HEIGHT = 240
exports.SCALE = 3

// Draw order
exports.DRAW_ORDER_BACKGROUND = 0
exports.DRAW_ORDER_NAME = 100
exports.DRAW_ORDER_ADVANCE_BTN = 200
exports.DRAW_ORDER_BOARD = 300
exports.DRAW_ORDER_DECK = 400
exports.DRAW_ORDER_TOP_HAND = 500
exports.DRAW_ORDER_BOTTOM_HAND = 600
exports.DRAW_ORDER_TOP_PLACE = 700
exports.DRAW_ORDER_BOTTOM_PLACE = 800
exports.DRAW_ORDER_MOVING_CARD = 1000
exports.DRAW_ORDER_CARD_DESCRIPTION = 1100
exports.DRAW_ORDER_DIALOG = 1200
exports.DRAW_ORDER_BUTTONS = 1300

// Colors
exports.WHITE = [1, 1, 1, 1]
exports.OUTLINE_COLOR = [24 / 255, 20 / 255, 37 / 255, 1]
exports.BACKGROUND_COLOR = [38 / 255, 43 / 255, 68 / 255, 1]
exports.CARD_NUMBER_COLOR = [58 / 255, 68 / 255, 102 / 255, 1]
exports.ROCK_CARD_NUMBER_COLOR = [1, 1, 1, 1]
exports.UNPLAYABLE_COLOR = [.8, .8, .8, 1] // Unplayable Card 20% darker
exports.DOWN_COLOR = [.6, .6, .6, 1] // Button down 40% darker
exports.ENERGY_COLOR = [44 / 255, 232 / 255, 245 / 255, 1]
exports.CARD_TEXT_COLOR = [58 / 255, 68 / 255, 102 / 255, 1]
exports.CARD_HOVER_COLOR = [254 / 255, 231 / 255, 97 / 255, 1]
exports.CARD_HOVER_OPPONENT_COLOR = [255 / 255, 0, 68 / 255, 1]
// exports.DIALOG_TEXT_COLOR = [90 / 255, 105 / 255, 136 / 255, 1]
exports.DIALOG_TEXT_COLOR = [58 / 255, 68 / 255, 102 / 255, 1]
exports.NAME_COLOR = [139 / 255, 155 / 255, 180 / 255, 1]
exports.HEALTY_COLOR = [99 / 255, 199 / 255, 77 / 255, 1]
exports.HURT_COLOR = [254 / 231, 155 / 255, 97 / 255, 1]
exports.DANGER_COLOR = [1, 0, 68 / 255, 1]

// Positionning and dimensions
exports.SPRITE_SHEET_DIMENSION = { width: 512.0, height: 512.0 }
exports.CARD_DIM = { width: 46, height: 62 }
exports.TOP_DECK_POS = { x: 37 - exports.CARD_DIM.width, y: 106 - exports.CARD_DIM.height }
exports.TOP_HAND_POS = { x: exports.WIDTH / 2, y: -exports.CARD_DIM.height + 40 }
exports.TOP_BOARD_POS = { x: exports.WIDTH / 2 - 1, y: exports.HEIGHT / 2 - exports.CARD_DIM.height - 6 }
exports.TOP_PLACE_POS = { x: 272, y: 47 }
exports.TOP_DISCARDED_POS = { x: exports.WIDTH + 50, y: exports.HEIGHT / 2 - exports.CARD_DIM.height - 10 }
exports.BOTTOM_DECK_POS = { x: 37 - exports.CARD_DIM.width, y: 196 - exports.CARD_DIM.height }
exports.BOTTOM_HAND_POS = { x: exports.WIDTH / 2, y: exports.HEIGHT - 40 }
exports.BOTTOM_BOARD_POS = { x: exports.WIDTH / 2 - 1, y: exports.HEIGHT / 2 + 7 }
exports.BOTTOM_PLACE_POS = { x: 272, y: 131 }
exports.BOTTOM_DISCARDED_POS = { x: exports.WIDTH + 50, y: exports.HEIGHT / 2 + 10 }
exports.ADVANCE_BUTTON_POS = { x: 280, y: 111 }
exports.HAND_SPACING = exports.CARD_DIM.width - 10
exports.BOARD_SPACING = exports.CARD_DIM.width + 1
exports.OK_BTN_POS = { x: exports.WIDTH / 2 - 9, y: exports.HEIGHT / 2 - 2 }
exports.DIALOG_SIZE = { x: 330 / 3, y: 42 }
exports.DIALOG_POS = { x: exports.WIDTH / 2 - 330 / 3 / 2, y: exports.HEIGHT / 2 - 108 / 3 / 2 }
exports.DIALOG_PADDING = { x: 7, y: 9, z: 9, w: 8 }

// Inventory
exports.NUM_ITEMS_PER_COL = 4
exports.NUM_ITEMS_PER_ROW = 2
exports.NUM_ITEMS_PER_INVENTORY_PAGE = exports.NUM_ITEMS_PER_COL * exports.NUM_ITEMS_PER_ROW
exports.INVENTORY_BUTTON_Y = 230
exports.INVENTORY_Y_HUD_OFFSET = 30
exports.INVENTORY_X_OFFSET = 20 + exports.CARD_DIM.width + exports.TOP_DECK_POS.x
exports.INVENTORY_Y_OFFSET = 20 + (exports.CARD_DIM.height / 2) + exports.TOP_DECK_POS.y

exports.SMALL_CARD_SIZE = { x: 220 / 3, y: 15 }
exports.SMALL_CARD_PADDING = { x: 12, y: 6, z: 6, w: 2 }

// States
exports.CardState = {
    IDLE: 0,
    IN_HAND: 1,
    IN_PLACE: 2, // Its waiting to be placed on the board
    IN_SPELL: 3,
    ON_BOARD: 4,
    MOVING_TO_HAND: 5,
    MOVING_TO_PLACE: 6,
    MOVING_TO_SPELL: 7,
    MOVING_TO_DISCARD: 8,
    MOVING_TO_BOARD: 9,
    MOVING_TO_ATTACK_CARD: 10,
    MOVING_TO_ATTACK_PLAYER: 11,
    MOVING_BACK_FROM_ATTACK: 12,
    INVENTORY_DISPLAY: 13
}

exports.GameState = {
    IDLE: 0,
    OPPONENT_TURN: 1,
    PICKING: 2,
    ATTACKING: 3,
    END_DIALOG: 4
}
