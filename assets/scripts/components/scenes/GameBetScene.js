import app from 'app';
import GameScene from 'GameScene';

export default class GameBetScene extends GameScene {
    constructor() {
        super();
        
        this.properties = this.assignProperties({
            chipLayer: cc.Node,
            meBalanceLabel: cc.Label
        });
        
        this.BOARD_COMPONENT = 'BoardGameBet';
        this.CONTROL_COMPONENT = 'GameBetControls';
        this.PLAYER_POSITION_COMPONENT = 'NinePlayerPositions';
    }

    onLoad() {
        super.onLoad();
    }

    onEnable() {
        this.board = this.boardNode.getComponent(this.BOARD_COMPONENT);
        this.gameControls = this.gameControlsNode.getComponent(this.CONTROL_COMPONENT);
        this.playerPositions = this.playerPositionAnchorsNode.getComponent(this.PLAYER_POSITION_COMPONENT);
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

app.createComponent(GameBetScene);