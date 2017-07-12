import Component from 'Component';

// export const betTypeNameToIdMap = {
//     round: 1,
//     odd: 2,
//     fourWhite: 3,
//     fourRed: 4,
//     threeWhite: 5,
//     threeRed: 6
// }

// export const betTypeIdToNameMap = {
//     1: 'round',
//     2: 'odd',
//     3: 'fourWhite',
//     4: 'fourRed',
//     5: 'threeWhite',
//     6: 'threeRed',
// }

export default class GameBetContainerButton extends Component {
    constructor() {
        super();

        this.nEven = {
            default: null,
            type: cc.Node
        };
        this.nOdd = {
            default: null,
            type: cc.Node
        };
        this.n4Whites = {
            default: null,
            type: cc.Node
        };
        this.n4Reds = {
            default: null,
            type: cc.Node
        };
        this.n3Reds1White = {
            default: null,
            type: cc.Node
        };
        this.n3Whites1Red = {
            default: null,
            type: cc.Node
        };
    }

    onLoad() {
        this.groupBtns = [this.nEven, this.nOdd, this.n4Whites, this.n4Reds, this.n3Whites1Red, this.n3Reds1White];
        this._typeSetup();
    }

    _typeSetup() {
        // this.nEven.id = 1;
        // this.nOdd.id = 2;
        // this.n4Reds.id = 3;
        // this.n4Blacks.id = 4;
        // this.n3Reds1Black.id = 5;
        // this.n3Blacks1Red.id = 6;
        this.groupBtns.forEach((btnNode, i) => {
            btnNode.id = (i + 1);
        });
    }

    //@typeId 1: Chẵn, 2: Lẻ, 3: 4 Trắng, 4: 4 Đỏ, 5: 3 Trắng 1 Đỏ, 6: 3 Đỏ 1 Trắng
    getBetTypeByTypeId(id) {
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

    doesBetTypeIdWin(id, dots) {
        // trắng: chẵn, đỏ: lẻ
        // id -> 1: Chẵn, 2: Lẻ, 3: 4 Trắng, 4: 4 Đỏ, 5: 3 Trắng 1 Đỏ, 6: 3 Đỏ 1 Trắng
        // even : [0, 0, 0, 0] || [1, 1, 1, 1] || [0, 0, 1, 1]
        let odds = dots.filter(dot => dot === 1).length;
        let evens = dots.filter(dot => dot === 0).length;

        let minus = Math.abs(evens - odds);

        let resultIsEven = (minus === 4 || minus === 0);

        let acceptedEven = resultIsEven && (id === 1 || (evens === 4 && id === 3) || (odds === 4 && id === 4));
        let acceptedOdd = (!resultIsEven) && (id === 2 || (evens === 3 && id === 5) || (odds === 3 && id === 6));

        return acceptedEven || acceptedOdd;
    }
    
    betable(state) {
        this.groupBtns.forEach(node => {
            let btn = node.getComponent(cc.Button);
            btn && (btn.interactable = state);
        });
    }
}