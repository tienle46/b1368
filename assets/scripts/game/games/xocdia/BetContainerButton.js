import app from 'app';
import Component from 'Component';
import BetOptionsGroup from 'BetOptionsGroup';

class BetContainerButton extends Component {
    constructor() {
        super();

        this.betOptionsGroup = {
            default: null,
            type: BetOptionsGroup
        };

        this.miniChip = {
            default: null,
            type: cc.Prefab
        };
    }

    onLoad() {

    }

    onBetWrapItemClick(event) {
        // a node where chip would be started from
        let fromNode = this.betOptionsGroup.getCheckedItem();
        let chipInfo = fromNode.getComponent('BetChip').getChipInfo()
        let startPoint = fromNode.parent.convertToWorldSpaceAR(fromNode.getPosition());

        // and node where chip would be tossed to
        let toNode = event.currentTarget;
        let toNodeSize = toNode.getContentSize();
        let toNodePos = toNode.getPosition();

        let randomRange = chipInfo.amount > 30 ? 30 : chipInfo.amount;

        new Array(app._.random(Math.ceil(randomRange / 2), randomRange)).fill(0).map(() => {
            // chip would be located inside `toNode` area
            let endPoint = cc.v2(toNodePos.x + cc.randomMinus1To1() * 1 / 2 * toNodeSize.width * 0.8, toNodePos.y + cc.randomMinus1To1() * 1 / 2 * toNodeSize.height * 0.8);
            // position based on world space
            let realEndPoint = toNode.parent.convertToWorldSpaceAR(endPoint);

            let miniChip = cc.instantiate(this.miniChip);
            miniChip.getComponent('BetChip').initChip(chipInfo);
            miniChip.setPosition(startPoint);
            cc.director.getScene().addChild(miniChip);
            let action = cc.moveTo(0.1, realEndPoint);

            miniChip.runAction(cc.sequence(action, cc.delayTime(2), cc.fadeOut(1), cc.callFunc(() => {
                miniChip.removeFromParent();
            })));
        });
    }


}

app.createComponent(BetContainerButton);