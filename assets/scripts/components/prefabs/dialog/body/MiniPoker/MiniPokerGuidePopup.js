import app from 'app';
import BasePopup from 'BasePopup';
import MiniPokerCardType from 'MiniPokerCardType';
import MiniPokerGuideItem from 'MiniPokerGuideItem';
import CCUtils from 'CCUtils';

class MiniPokerGuidePopup extends BasePopup {

    constructor() {
        super();

        this.properties = this.assignProperties({
            // royalFlush: cc.Node,
            item: cc.Node,
            container: cc.Node
        });

        this.DEFAULT_CONFIG = [];
        this.DEFAULT_CONFIG[MiniPokerCardType.DOI_J] = 2.5;
        this.DEFAULT_CONFIG[MiniPokerCardType.HAI_DOI] = 5;
        this.DEFAULT_CONFIG[MiniPokerCardType.SAM] = 8;
        this.DEFAULT_CONFIG[MiniPokerCardType.SANH] = 13;
        this.DEFAULT_CONFIG[MiniPokerCardType.THUNG] = 20;
        this.DEFAULT_CONFIG[MiniPokerCardType.CU_LU] = 50;
        this.DEFAULT_CONFIG[MiniPokerCardType.TU_QUY] = 150;
        this.DEFAULT_CONFIG[MiniPokerCardType.THUNG_PHA_SANH] = 1000;

        this.DEFAULT_BET = [100, 1000, 10000];

    }

    onLoad() {
        super.onLoad();

        this.scheduleOnce(this._loadConfig, 0.25);
    }

    onEnable() {
        super.onEnable();

        // this.scheduleOnce(this._loadConfig, 0.25);
    }

    _removeOldChildren() {
        CCUtils.clearAllChildren(this.container);
    }

    _loadConfig() {
        this._removeOldChildren();

        var config = app.miniPokerContext.prizeConfig || this.DEFAULT_CONFIG;
        var bets = app.miniPokerContext.betValues || this.DEFAULT_BET;

        var listPrize = null;
        for (var i = 9; i >= 1; i--) {
            var multi = config[i];
            if (multi) {
                listPrize = bets.map((bet) => {
                    return bet * multi;
                });
            }
            this._generateItem(i, listPrize);
        }
    }

    _generateItem(type, listPrize) {
        var child = cc.instantiate(this.item);
        child.getComponent(MiniPokerGuideItem).loadItem(MiniPokerCardType.getNameForType(type), type, listPrize);
        child.active = true;
        this.container.addChild(child);
    }

}

app.createComponent(MiniPokerGuidePopup);
