import app from 'app';
import Component from 'Component';

class BowlDishControl extends Component {
    constructor() {
        super();

        this.wrapper = {
            default: null,
            type: cc.Node
        };

        this.bowlNode = {
            default: null,
            type: cc.Node
        };


    }

    onLoad() {
        this.bowlPos = this.bowlNode.getPosition();
        this.wrapper.zIndex = 9999;
    }

    dishShaker() {
        let startPos = this.wrapper.getPosition();
        this.bowlNode.setPosition(this.bowlPos);

        let goPos = cc.v2(startPos.x, startPos.y - 50);
        let shakers = [startPos, { x: startPos.x, y: startPos.y + 1 }, { x: startPos.x, y: startPos.y - 4 }, { x: startPos.x + 3, y: startPos.y }, { x: startPos.x - 7, y: startPos.y - 4 }, { x: startPos.x + 3, y: startPos.y + 2 }, { x: startPos.x - 6, y: startPos.y + 1 }, { x: startPos.x - 12, y: startPos.y - 1 }, { x: startPos.x - 14, y: startPos.y - 2 }, { x: startPos.x - 7, y: startPos.y - 4 }, { x: startPos.x - 7, y: startPos.y - 9 }, { x: startPos.x, y: startPos.y - 9 }, startPos];
        let actions = shakers.map((s) => cc.moveTo(0.01, cc.v2(s.x, s.y)).clone());
        let sequence = cc.sequence(cc.fadeOut(0.1).clone(), cc.scaleTo(0.2, 2).clone(), cc.moveTo(0.1, goPos).clone(), cc.fadeIn(0.5).clone(), cc.callFunc(() => {
            let foreverAction = cc.repeatForever(cc.sequence(actions));
            this.wrapper.runAction(foreverAction);
        }));
        this.wrapper.runAction(sequence);
    }

    stopDishShaker() {
        let startPos = this.wrapper.getPosition();
        this.wrapper.stopAllActions();
        let actions = [cc.fadeOut(0.1).clone(), cc.moveTo(0.1, startPos).clone(), cc.scaleTo(0.2, 1), cc.fadeIn(0.1).clone()];
        let sequence = cc.sequence(actions);
        this.wrapper.runAction(sequence);
    }

    openBowlAnim() {
        let bowlPos = this.bowlPos;
        let action = cc.moveTo(1, cc.v2(this.bowlPos.x - 2 / 3 * this.bowlNode.getContentSize().width, bowlPos.y));
        this.bowlNode.runAction(cc.sequence(action), cc.callFunc(() => {
            this.bowlPos = bowlPos;
        }));
    }
}

app.createComponent(BowlDishControl);