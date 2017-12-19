import app from 'app';
import BasePopup from 'BasePopup';
import MiniPokerCardType from 'MiniPokerCardType';
import MiniPokerGuideItem from 'MiniPokerGuideItem';

class MiniPokerGuidePopup extends BasePopup {

    constructor() {
        super();

        this.properties = this.assignProperties({
            royalFlush: cc.Node,
            item: cc.Node,
            container: cc.Node
        });

        this.curConfig = null;
    }

    onLoad() {
        super.onLoad();

        this._loadConfig();
    }

    _removeOldChildren() {
        this.container.children.forEach((child) => {
            if (child !== this.royalFlush && child !== this.item) {
                child.removeFromParent();
            }
        });
    }

    _loadConfig() {
        this._removeOldChildren();

        for (var i = 8; i >= 1; i--) {
            this._generateItem(i, [100, 1000, 10000]);
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
