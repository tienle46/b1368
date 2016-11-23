import app from 'app';
import Component from 'Component';

class TableListCell extends Component {
    constructor() {
        super();

        this.numberCoinLabel = {
            default: null,
            type: cc.Label
        };

        this.levelBkg = {
            default: null,
            type: cc.Sprite
        };

        this.roomProgress = {
            default: null,
            type: cc.ProgressBar
        };

        this.lockIcon = {
            default: null,
            type: cc.Node
        };

        this.ratio = {
            default: null,
            type: cc.Label
        };

        this._onClickListener = null;
    }

    onLoad() {
        this.balance = app.context.getMyInfo().coin;
    }

    initCell(id, minBet, userCount = 1, userMax, password) {
        id && (this.id = id);
        minBet && this._changeMinBet(minBet);
        (userCount || userCount === 0) && userMax && this._changeProgressBar(userCount, userMax);
        password && this._roomPassword(password);
    }

    _changeMinBet(minBet) {
        this.minBet = minBet;
        this.numberCoinLabel.string = this.minBet;
    }

    _changeProgressBar(current, max) {
        this.ratio.string = `${current}/${max}`;
        this.roomProgress.progress = current / max;
    }

    _roomPassword(password) {
        this.lockIcon.active = true;
        this.password = password;
    }


    setOnClickListener(clickListener) {
        this._onClickListener = clickListener instanceof Function && clickListener;
    }

    onClickEvent() {
        this._onClickListener && this._onClickListener();
    }
}
app.createComponent(TableListCell);