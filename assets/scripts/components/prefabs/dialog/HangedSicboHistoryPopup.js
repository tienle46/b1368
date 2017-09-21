import app from 'app';
import Actor from 'Actor';

class HangedSicboHistoryPopup extends Actor {
    constructor() {
        super();
        
        this.properties = this.assignProperties({
            bgTransparent: cc.Node,
            container: cc.Node,
            historicalItem: cc.Node,
            itemIdLbl: cc.RichText,
            dateLbl: cc.Label,
            betted: cc.RichText,
            result: cc.RichText,
            receive: cc.Label,
            payback: cc.Label
        })
    }

    onLoad() {
        super.onLoad();
        // this._initComponents();
        this.bgTransparent.on('touchstart', function() {
            return;
        });
    }
    
    _addGlobalListener() {
        super._addGlobalListener();
        app.system.addListener(app.commands.MINIGAME_TAI_XIU_HISTORY, this._onTaiXiuHistory, this);
    }

    _removeGlobalListener() {
        super._removeGlobalListener();
        app.system.removeListener(app.commands.MINIGAME_TAI_XIU_HISTORY, this._onTaiXiuHistory, this);
    }
    
    start() {
        super.start();
        app.service.send({cmd: app.commands.MINIGAME_TAI_XIU_HISTORY})
    }
    
    onDestroy() {
        super.onDestroy();
    }
    
    _onTaiXiuHistory(data) {
        console.warn('data', data)
    }
    
    onCloseBtnClick() {
        this.node.destroy()
    }
}

app.createComponent(HangedSicboHistoryPopup);