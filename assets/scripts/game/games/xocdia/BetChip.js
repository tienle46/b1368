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

        this.color = color || this.getChipInfoByAmount(amount).color;


        size && (this.size = size);

        // size
        if (size) {
            this.node.setContentSize(size);
            this.amountLbl.node.setContentSize(size);
            this.amountLbl.fontSize = size.width / 2;
            this.amountLbl.lineHeight = size.height;
        }

        // color
        this.amountLbl.node.parent.color = this.color;
        this.amountLbl.node.color = this.color;

        // string
        this.amountLbl && (this.amountLbl.string = `${this._convertAmountFromNumberToString(amount)}`);
        // console.debug(amount, color, size);
    }

    // 1000 -> 1k , 10000 -> 10k
    _convertAmountFromNumberToString(amount) {
        if (amount < 1000)
            return amount.toString();

        let divided = (amount / 1000).toString();

        return divided.match(/\d+(\.)/) ? divided.replace('.', 'K') : `${divided}K`;
    }

    _convertAmountFromStringToNum(str) {
        str = str.replace('k', '.');
        let amount = Number(str);

        return str.match(/\d+(\.)/) ? amount * 1000 : amount;
    }

    getChipInfo() {
        let { amount, color, size } = { amount: this.amount, color: this.color, size: this.size };
        return { amount, color, size };
    }

    onChipChecked() {
        this.node.dispatchEvent(new cc.Event('chip-checked', true));
        this.amount = this._convertAmountFromStringToNum(this.amountLbl.string);
        this.color = this.amountLbl.node.color;
        this.size = cc.size(20, 20);
    }

    getChipInfoByAmount(amount, isMiniChip) {
        console.debug('getChipInfo', this.roomBet, amount, isMiniChip)
        let color, size;
        size = isMiniChip ? cc.size(20, 20) : this.node.getContentSize();
        this.roomBet && (amount = amount / this.roomBet);
        let condition = Number(this._convertAmountFromNumberToString(amount).replace('k', '.'));

        if (condition < 5) {
            color = app.const.COLOR_RED;
        } else if (condition < 10) {
            color = app.const.COLOR_GREEN;
        } else if (condition < 50) {
            color = app.const.COLOR_ORANGE;
        } else {
            color = app.const.COLOR_BLACK;
        }

        return { amount, color, size };
    }
}

app.createComponent(BetChip);