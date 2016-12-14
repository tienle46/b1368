import app from 'app';
import Component from 'Component';

class BetChip extends Component {
    constructor() {
        super();

        this.amountLbl = {
            default: null,
            type: cc.Label
        };

        this.amount = null;
        this.color = null;
        this.size = null;
    }

    onLoad() {
        if (this.node.getComponent(cc.Toggle) && this.node.getComponent(cc.Toggle).isChecked) {
            this.onChipChecked();
        }
    }

    initChip({ amount, color, size } = { amount: 1, color: app.const.COLOR_BLACK, size: cc.size(20, 20) }) {
        this.amount = amount;
        this.color = color;
        this.size = size;

        // size
        this.node.setContentSize(size);
        this.amountLbl.node.setContentSize(size);
        this.amountLbl.fontSize = size.width / 2;
        this.amountLbl.lineHeight = size.height;

        // color
        this.amountLbl.node.parent.color = color;
        this.amountLbl.node.color = color;

        // string
        this.amountLbl && (this.amountLbl.string = `${amount}K`);
        // console.debug(amount, color, size);
    }

    getChipInfo() {
        let { amount, color, size } = { amount: this.amount, color: this.color, size: this.size };
        return { amount, color, size };
    }

    onChipChecked() {
        this.node.dispatchEvent(new cc.Event('chip-checked', true));
        this.amount = this.amountLbl.string.substr(0, this.amountLbl.string.length - 1);
        this.color = this.amountLbl.node.color;
        this.size = cc.size(20, 20);
    }

    getChipInfoByAmount(a) {
        let amount, color, size;
        amount = a;
        size = cc.size(20, 20);
        switch (amount) {
            case 1:
                color = app.const.COLOR_RED;
                break;
            case 5:
                color = app.const.COLOR_GREEN;
                break;
            case 10:
                color = app.const.COLOR_ORANGE;
                break;
            case 50:
                color = app.const.COLOR_BLACK;
                break;
        }
        return { amount, color, size };
    }
}

app.createComponent(BetChip);