/**
 * Created by Thanh on 10/31/2016.
 */

import app from 'app';
import GameScene from 'GameScene';
import Events from 'Events';
import HorizontalBetPopup from 'HorizontalBetPopup';
import GameUtils from 'GameUtils';

export default class XocDiaScene extends GameScene {
    constructor() {
        super();

        this.properties = {
            ...this.properties,
            chipLayer: {
                default: null,
                type: cc.Node
            },

            meBalanceLabel: {
                default: null,
                type: cc.Label
            }
        };

        this.userGold = 0;
    }

    onLoad() {
        super.onLoad();
    }

    onEnable() {
        this.board = this.boardNode.getComponent('BoardXocDia');
        this.gameControls = this.gameControlsNode.getComponent('XocDiaControls');
        this.playerPositions = this.playerPositionAnchorsNode.getComponent('NinePlayerPositions');
        // this.gameResultPopup = this.gameResultPopupNode.getComponent('GameResultPopup');

        super.onEnable();
    }
    
    enoughPlayerToStartGame() {
        return this.gamePlayers.players.length > 0;
    }

    changePlayerBalance(amount) {
        this.gamePlayers.me && this.gamePlayers.me.changePlayerBalance(amount);
    }

    setPlayerBalance(amount) {
        this.gamePlayers.me && this.gamePlayers.me.setPlayerBalance(amount);
    }

    loadPlayerBalance() {
        this.gamePlayers.me && this.gamePlayers.me.loadPlayerBalance();
    }
}

app.createComponent(XocDiaScene);