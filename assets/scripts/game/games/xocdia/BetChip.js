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

        if (str.length >= 4) {
            let size = {
                width: 150,
                height: this.node.getContentSize().height
            };
            this.node.setContentSize(size);
        }
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

    getChipIcon(size) {
        let chipIcon = cc.instantiate(this.chipIconNode);
        size && chipIcon.setContentSize(size);
        return chipIcon;
    }

    getChipAmount() {
        return this.amount;
    }

    onChipChecked() {
        this.node.dispatchEvent(new cc.Event('chip-checked', true));
        (!this.amount) && (this.amount = this._convertAmountFromStringToNum(this.amountLbl.string));
        this.setLblColor(app.const.COLOR_YELLOW);
    }

    setLblColor(color) {
        this.amountLbl.node.color = color;
    }
}

app.createComponent(BetChip);