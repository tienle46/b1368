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
        return this.getCheckedItem().getComponent('BetChip').getChipInfoByAmount(amount);
    }
}

app.createComponent(BetOptionsGroup);