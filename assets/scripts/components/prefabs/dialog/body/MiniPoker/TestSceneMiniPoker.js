import app from 'app';
import Actor from 'Actor';
import MiniPokerPopup from 'MiniPokerPopup';

class TestSceneMiniPoker extends Actor {
    constructor() {
        super();

        this.properties = this.assignProperties({
            miniPokerPrefab: cc.Prefab
        });

        this.miniPokerPopup = null;
    }

    onBtnShowMiniPoker() {
        this._initMiniPokerPopup();

        var miniPokerController = this.miniPokerPopup.getComponent(MiniPokerPopup);
        miniPokerController.openPopup(true);
    }

    _initMiniPokerPopup() {
        if (!this.miniPokerPopup) {
            this.miniPokerPopup = cc.instantiate(this.miniPokerPrefab);
            this.miniPokerPopup.active = false;
            this.miniPokerPopup.position = cc.p(0,0);
            this.addNode(this.miniPokerPopup);
            this.node.addChild(this.miniPokerPopup, 10);
        }
    }
}

app.createComponent(TestSceneMiniPoker);