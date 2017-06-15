import app from 'app';
import Component from 'Component';
import { isFunction } from 'Utils';
import CCUtils from 'CCUtils';

class TableListCell extends Component {
    constructor() {
        super();
        
        this.properties = this.assignProperties({
            numberCoinLabel: cc.Label,
            roomProgress: cc.ProgressBar,
            lockIcon: cc.Node,
            ratio: cc.Label,
            idLbl: cc.Label
        });

        this._onClickListener = null;
    }
    
    initCell({ id = 0, displayId = 0, minBet = 0, userCount = 0, roomCapacity = 0, password} = {}) {
        this.setComponentData({ id, displayId, minBet, userCount, roomCapacity, password});
    }

    renderComponentData(data) {
        if(data) {
            this.id = data.id;
            let isFake = !(data.displayId > 0);
            if(isFake){
                this.idLbl.node.color = app.const.COLOR_YELLOW;
                this.ratio.node.color = app.const.COLOR_YELLOW;
            }
            
            this.idLbl.string = data.displayId > 0 ? `${data.displayId}` : "#";
            this.numberCoinLabel.string = data.minBet;
            CCUtils.setVisible(this.lockIcon, data.password);

            this._changeProgressBar(data.userCount, data.roomCapacity);
        }
    }

    _changeProgressBar(current, max) {
        this.ratio.string = `${current}/${max}`;
        this.roomProgress.progress = current / max;
    }

    onDestroy() {
        super.onDestroy();
        this._onClickListener = null;
    }

    setOnClickListener(clickListener) {
        this._onClickListener = isFunction(clickListener) && clickListener;
    }

    onClickEvent() {
        this._onClickListener && this._onClickListener(this.getComponentData());
    }
}
app.createComponent(TableListCell);