import app from 'app';
import Component from 'Component';

class BetChip extends Component {
    constructor() {
        super();

        this.amountLbl = {
            default: null,
            type: cc.Label
        };

        this.chipIconNode = {
            default: null,
            type: cc.Node
        };
        this.amount = null;
    }

    onLoad() {
        if (this.node.getComponent(cc.Toggle) && this.node.getComponent(cc.Toggle).isChecked) {
            this.onChipChecked();
        }
    }

    setChipAmountLbl(amount) {
        this.amount = Number(amount) || 0;
        let str = isNaN(amount) ? amount : this._convertAmountFromNumberToString(amount);
        this.amountLbl.string = str;

        if (str.length >= 3) {
            let size = {
                width: 150,
                height: this.node.getContentSize().height
            };
            this.node.setContentSize(size);
        }
    }

    // 1000 -> 1k , 10000 -> 10k, 15000 -> 15k
    // 1.000.000 -> 1M , 1.500.000 -> 1.5M
    _convertAmountFromNumberToString(amount) {
        if (amount < 1000)
            return amount.toString();

        if (amount < 1000 * 1000) {
            let divided = (amount / 1000).toString();

            return divided.match(/\d+(\.)/) ? divided.replace('.', 'K') : `${divided}K`;
        } else {
            let divided = (amount / (1000 * 1000)).toString();
            return `${divided}M`;
        }
    }

    // 1k -> 1000, 10k -> 10.000, 15k -> 15000
    // 1M -> 1.000.000, 1.5M -> 1.500.000
    _convertAmountFromStringToNum(str) {
        let amount = 0;
        if (str.indexOf('K') > -1) {
            str = str.replace('K', '.');
            amount = Number(str);
            return str.match(/\d+(\.)/) ? amount * 1000 : amount;
        } else if (str.indexOf('M') > -1) {
            str = str.replace('M', '.');
            amount = Number(str);
            return str.match(/\d+(\.)/) ? amount * 1000 * 1000 : amount;
        }
    }

    getChipIcon(size) {
        let chipIcon = cc.instantiate(this.chipIconNode);
        size && chipIcon.setContentSize(size);
        return chipIcon;
    }

    getChipAmount() {
        return this.amount;
    }

    onChipChecked() {
        this.node.dispatchEvent(new cc.Event.EventCustom('chip-checked', true));
        (!this.amount) && (this.amount = this._convertAmountFromStringToNum(this.amountLbl.string));
        this.setLblColor(app.const.COLOR_YELLOW);
    }

    setLblColor(color) {
        this.amountLbl.node.color = color;
    }
}

app.createComponent(BetChip);