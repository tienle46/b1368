import Component from 'Component';

export default class GameBetContainerButton extends Component {
    constructor() {
        super();
        
        this.properties = this.assignProperties({
            groupBtns: {
                default: [],
                type: [cc.Node]
            }
        });
        
        // map the ids rely on the server. Eg: (xocdia)
        // 1: 'even',
        // 2: 'odd',
        // 3: 'fourWhite',
        // 4: 'fourRed',
        // 5: 'threeWhite',
        // 6: 'threeRed'
        this.betTypeIdsMap = []
        
        this.BET_TYPE_BTN_COMPONENT = 'BetTypeBtn';
    }

    onLoad() {
        this._typeSetup();
    }
    
    _typeSetup() {
        this.groupBtns.forEach((btnNode, i) => {
            btnNode.id = this.betTypeIdsMap[i];
        });
    }
    
    //@typeId 1: Chẵn, 2: Lẻ, 3: 4 Trắng, 4: 4 Đỏ, 5: 3 Trắng 1 Đỏ, 6: 3 Đỏ 1 Trắng
    getBetTypeByTypeId(id) {
        return this.groupBtns.find(btnNode => btnNode.id == id);
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
            btn.getComponent(this.BET_TYPE_BTN_COMPONENT).setLbls(0);
        });
    }
    
    // betTypeBtn
    userBetApperanace(state = true) {
       this.groupBtns.forEach((btn) => {
            btn.getComponent(this.BET_TYPE_BTN_COMPONENT).setLbls(0);
        }); 
    }
    
    // interface
    doesBetTypeIdWin(id, dots) {}
    
    betable(state) {
        this.groupBtns.forEach(node => {
            let btn = node.getComponent(cc.Button);
            btn && (btn.interactable = state);
        });
    }
    
    getBetTypeIdToNameMap() {
        return this.groupBtns.reduce((obj, node) => {
            obj[node.id] = node._id;
            return obj;
        }, {});
    }
}