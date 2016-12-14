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

        this.nEven = {
            default: null,
            type: cc.Node
        };
        this.nOdd = {
            default: null,
            type: cc.Node
        };
        this.n4Blacks = {
            default: null,
            type: cc.Node
        };
        this.n4Reds = {
            default: null,
            type: cc.Node
        };
        this.n3Reds1Black = {
            default: null,
            type: cc.Node
        };
        this.n3Blacks1Red = {
            default: null,
            type: cc.Node
        };
    }

    onLoad() {
        this._typeSetup();
    }

    _typeSetup() {
        this.nEven.id = 1;
        this.nOdd.id = 2;
        this.n4Reds.id = 3;
        this.n4Blacks.id = 4;
        this.n3Reds1Black.id = 5;
        this.n3Blacks1Red.id = 6;
    }

    // @type 1: Chẵn, 2: Lẻ, 3: 4 Đỏ, 4: 4 Đen, 5: 3 Đỏ 1 Đen, 6: 3 Đen 1 Đỏ
    getBetTypeByTypeId(id) {
        let type = null;
        switch (id) {
            case 1:
                type = this.nEven;
                break;
            case 2:
                type = this.nOdd;
                break;
            case 3:
                type = this.n4Reds;
                break;
            case 4:
                type = this.n4Blacks;
                break;
            case 5:
                type = this.n3Reds1Black;
                break;
            case 6:
                type = this.n3Blacks1Red;
                break;
        }

        return type;
    }

    getBetTypePositionById(id) {
        let type = this.getBetTypeByTypeId(id);

        return type.getPosition();
    }

    getRealBetTypePositionById(id) {
        let type = this.getBetTypeByTypeId(id);
        let position = type.getPosition();
        let realPosition = type.parent.convertToWorldSpaceAR(position);
        return type.getPosition(realPosition);
    }

    onBetWrapItemClick(event) {
        // a node where chip would be started from
        let fromNode = this.betOptionsGroup.getCheckedItem();
        let chipInfo = fromNode.getComponent('BetChip').getChipInfo();
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

            miniChip.runAction(cc.sequence(action.clone(), cc.delayTime(2).clone(), cc.fadeOut(1).clone(), cc.callFunc(() => {
                miniChip.removeFromParent();
            })));
        });
    }


}

app.createComponent(BetContainerButton);