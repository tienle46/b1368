import app from 'app';
import Component from 'Component';

class BetTypeBtn extends Component {
    constructor() {
        super();

        this.allLbl = {
            default: null,
            type: cc.Label
        };

        this.ownLbl = {
            default: null,
            type: cc.Label
        };
    }

    onLoad() {
        this.setLbls(0);
    }

    setAllLbl(amount) {
        this.allLbl.string = amount;
    }

    setOwnLbl(amount) {
        this.ownLbl.string = amount;
    }

    setLbls(amount) {
        this.setAllLbl(amount);
        this.setOwnLbl(amount);
    }

    getAllLbl() {
        return Number(this.allLbl.string);
    }

    getOwnLbl() {
        return Number(this.ownLbl.string);
    }

    updateAllLbl(amount, isMinus) {
        let rs = this.getAllLbl() + amount;
        if (isMinus) {
            rs = this.getAllLbl() - amount;
        }
        this.setAllLbl(rs < 0 ? 0 : rs);
    }

    updateOwnLbl(amount, isMinus) {
        let rs = this.getOwnLbl() + amount;
        if (isMinus) {
            rs = this.getOwnLbl() - amount;
        }
        this.setOwnLbl(rs < 0 ? 0 : rs);
    }

    updateLbls(amount, isMinus) {
        this.updateAllLbl(amount, isMinus);
        this.updateOwnLbl(amount, isMinus);
    }
}

app.createComponent(BetTypeBtn);