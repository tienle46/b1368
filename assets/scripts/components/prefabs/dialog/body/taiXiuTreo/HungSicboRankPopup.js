import app from 'app'
import DialogActor from 'DialogActor'
import {numberFormat} from 'GeneralUtils'

export default class HungSicboRankPopup extends DialogActor {
    constructor() {
        super();

        this.properties = this.assignProperties({
            bgNode: cc.Node,
            item: cc.Node,
            itemContainerNode: cc.Node,
            orderLbl: cc.Label,
            usernameLbl: cc.Label,
            userAmount: cc.Label
        });
    }

    onLoad() {
        super.onLoad();
        this.bgNode && this.bgNode.on(cc.Node.EventType.TOUCH_START, () => true);
    }

    start() {
        super.start();
        this._getTopPlayers();
    }
    
    onDestroy() {
        super.onDestroy();
    }
    
    _addGlobalListener() {
        super._addGlobalListener();
        app.system.addListener(app.commands.MINIGAME_TAI_XIU_TOP_PLAYERS, this._onListRank, this);
    }

    _removeGlobalListener() {
        super._removeGlobalListener();
        app.system.removeListener(app.commands.MINIGAME_TAI_XIU_TOP_PLAYERS, this._onListRank, this);
    }
    
    _onListRank(data) {
        let {topPlayers} = data
        
        topPlayers && topPlayers.forEach((player, index) => this._addItem(player, index + 1))
    }
    
    _getTopPlayers() {
        app.service.send({cmd: app.commands.MINIGAME_TAI_XIU_TOP_PLAYERS})
    }
    
    _addItem(player, index) {
        let {winAmount, playerName} = player
        this.orderLbl.string = index
        this.usernameLbl.string = playerName
        this.userAmount.string = numberFormat(winAmount)
        
        let item = cc.instantiate(this.item)
        item.active = true
        
        this.itemContainerNode.addChild(item)
    }
    
    onCloseBtnClick() {
        this.node.destroy()
    }
}

app.createComponent(HungSicboRankPopup);