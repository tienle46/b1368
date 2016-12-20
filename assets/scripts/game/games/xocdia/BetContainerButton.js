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
        this.groupBtns = [this.nEven, this.nOdd, this.n4Reds, this.n4Blacks, this.n3Reds1Black, this.n3Blacks1Red];
        this._typeSetup();
    }

    _typeSetup() {
        // this.nEven.id = 1;
        // this.nOdd.id = 2;
        // this.n4Reds.id = 3;
        // this.n4Blacks.id = 4;
        // this.n3Reds1Black.id = 5;
        // this.n3Blacks1Red.id = 6;
        this.groupBtns.forEach((btn, i) => {
            btn.id = (i + 1);
        });
    }

    // @type 1: Chẵn, 2: Lẻ, 3: 4 Đỏ, 4: 4 Đen, 5: 3 Đỏ 1 Đen, 6: 3 Đen 1 Đỏ
    getBetTypeByTypeId(id) {
        // let type = null;
        // switch (id) {
        //     case 1:
        //         type = this.nEven;
        //         break;
        //     case 2:
        //         type = this.nOdd;
        //         break;
        //     case 3:
        //         type = this.n4Reds;
        //         break;
        //     case 4:
        //         type = this.n4Blacks;
        //         break;
        //     case 5:
        //         type = this.n3Reds1Black;
        //         break;
        //     case 6:
        //         type = this.n3Blacks1Red;
        //         break;
        // }

        // return type;
        return this.groupBtns[id - 1];
    }

    getBetTypePositionById(id) {
        let type = this.getBetTypeByTypeId(id);

        return type.getPosition();
    }

    getRealBetTypePositionById(id) {
        let type = this.getBetTypeByTypeId(id);
        let position = type.getPosition();
        let node = type.parent || type;
        let realPosition = node.convertToWorldSpaceAR(position);
        return type.getPosition(realPosition);
    }

    resetBtns() {
        this.groupBtns.forEach((btn) => {
            btn.getComponent('BetTypeBtn').setLbls(0);
        });
    }

    isShakedDotsReturnEvenResult(dots) {
        // 1: Chẵn, 2: Lẻ, 3: 4 Đỏ, 4: 4 Đen, 5: 3 Đỏ 1 Đen, 6: 3 Đen 1 Đỏ
        // even : [0, 0, 0, 0] || [1, 1, 1, 1] || [0, 0, 1, 1]
        let count1 = dots.filter(dot => dot === 1).length;
        let count0 = dots.filter(dot => dot === 0).length;

        let minus = Math.abs(count1 - count0);
        return (minus === 4 || minus === 0);
    }
}

app.createComponent(BetContainerButton);