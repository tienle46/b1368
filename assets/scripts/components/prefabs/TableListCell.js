import app from 'app';
import Component from 'Component';
import { isFunction } from 'Utils';
import CCUtils from 'CCUtils';

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

        this.idLbl = {
            default: null,
            type: cc.Label
        };

        this._onClickListener = null;
    }

    initCell({id = 0, displayId = 0, minBet = 0, userCount = 0, userMax = 0, password} = {}) {
        this.setComponentData({id, displayId, minBet, userCount, userMax, password})
    }

    renderComponentData(data){
        this.id = data.id;
        this.idLbl.string = data.displayId > 0 ? `${data.displayId}` : "#";
        this.numberCoinLabel.string = data.minBet;
        CCUtils.setVisible(this.lockIcon, data.password)

        this._changeProgressBar(data.userCount, data.userMax);
    }

    _changeProgressBar(current, max) {
        this.ratio.string = `${current}/${max}`;
        this.roomProgress.progress = current / max;
    }

    onDestroy() {
        super.onDestroy();
        this._onClickListener = null
    }

    setOnClickListener(clickListener) {
        this._onClickListener = isFunction(clickListener) && clickListener;
    }

    onClickEvent() {
        this._onClickListener && this._onClickListener(this.getComponentData());
    }
}
app.createComponent(TableListCell);