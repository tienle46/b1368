import app from 'app';
import Component from 'Component';

class BetOptionsGroup extends Component {
    constructor() {
        super();

        this.checkedItem = null;
        this.userGoldLbl = {
            default: null,
            type: cc.Label
        };
    }

    onLoad() {
        this.node.on('chip-checked', (event) => {
            event.stopPropagation();
            this.checkedItem = event.target;
        });

        this.userGoldLbl.string = app.context.getMyInfo().coin || 0;
    }

    setLblOptions(roomBet) {
        let multiples = [1, 5, 10, 50];
        this.node.children.filter((child) => child.name.indexOf('chip') > -1).forEach((child, index) => {
            let amount = multiples[index] * Number(roomBet);
            let betChip = child.getComponent('BetChip');
            let size = child.getContentSize();
            betChip.initChip({ amount, size });
            betChip.roomBet = roomBet;
        });
    }

    getCheckedItem() {
        return this.checkedItem;
    }

    updateUserGoldLbl(amount) {
        this.userGoldLbl.string = amount;
    }

    getCurrentUserGold() {
        return Number(this.userGoldLbl.string);
    }

    getChipInfoByAmount(amount) {
        return this.getCheckedItem().getComponent('BetChip').getChipInfoByAmount(amount, true);
    }
}

app.createComponent(BetOptionsGroup);