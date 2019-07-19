import React, { Component } from 'react'
import GameIcon from './GameIcon';
import './style.css'


// Props:
//  onBack
class HowToScreen extends Component {
    onBack() {
        this.props.onBack()
    }

    render() {
        return (
            <div className="HowToScreen">
                <div id="htp-titleBar">
                    <div id="htp-backWrapper">
                        <button id="btn-blue" onClick={this.onBack.bind(this)}>BACK</button>
                    </div>
                    <div id="htp-whiteTitleWrapper">
                        <h1 id="htp-whiteTitle">Warstone</h1>
                    </div>
                </div>

                <div id="htp-wrapper">
                    <h1 id="htp-title">Goal of the game</h1>
                    <p id="htp-text">Reduce your opponent's HP <GameIcon name="icon-heart"/> (hitpoints) to zero. Your HP <GameIcon name="icon-heart" /> value is displayed on the right, near your player name. Players take turns playing cards from their hand to the table, and using cards on the table to attack the opponent's cards or the opponent's HP <GameIcon name="icon-heart" />.</p>

                    <h1 id="htp-title">Gameplay</h1>
                    <p id="htp-text">At the start of each turn, the player gets to draw one card for free and the player gets a limited amount of POWER <GameIcon name="icon-power" /> to take actions. Your POWER <GameIcon name="icon-power" /> is shown on the right, near your player name. More powerful cards cost more POWER <GameIcon name="icon-power" /> to play. The power you get to use increases each turn. Players can also spend POWER <GameIcon name="icon-power" /> to draw additional cards, which may give a strategic advantage in later turns.</p>
                    <p id="htp-text">Players get a limited amount of time to play or draw cards and then conclude their turn by pressing the green END TURN button. Time remaining is shown by a red bar in the center of the screen, which gradually gets shorter. Cards played can't attack until the next turn, unless they have the LIGHTNING <GameIcon name="icon-bolt" /> ability symbol.</p>
                    <p id="htp-text">When your cards are ready to act, select one of your cards by clicking it, and then choose what to attack. You may attack the opponent's cards or the opponent's HP <GameIcon name="icon-heart" /> directly. Cards posessing the TAUNT <GameIcon name="icon-taunt" /> ability force the opponent to deal with that card before all others.</p>
                    <p id="htp-text">When attacking, each card deals damage to the other according to their ATTACK <GameIcon name="icon-attack" /> power.</p>
                    <p id="htp-text">Cards have the following suits: ROCK, PAPER and SCISSORS.</p>
                    <ul>
                        <li class="htp-bullet">ROCK deals double damage to SCISSORS</li>
                        <li class="htp-bullet">SCISSORS deals double damage to PAPER</li>
                        <li class="htp-bullet">PAPER deals double damage to ROCK</li>
                    </ul>
                    <p id="htp-text">If a card runs out of HP <GameIcon name="icon-heart" />, it is discarded from the table. When you have taken all the actions you want, press the END TURN button to finish your turn.</p>
                    <p id="htp-text">The game ends when one player's HP <GameIcon name="icon-heart" /> reaches zero.</p>
                </div>
            </div>
        )
    }
}

export default HowToScreen;
