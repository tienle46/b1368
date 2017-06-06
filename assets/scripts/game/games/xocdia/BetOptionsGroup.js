import app from 'app';
import Component from 'Component';

const MULTIPLES = [1, 5, 10, 50];

class BetOptionsGroup extends Component {
    constructor() {
        super();

        this.checkedItem = null;

        this.chips = [];

    }

    onLoad() {
        this.node.on('chip-checked', (event) => {
            event.stopPropagation();
            if (this.checkedItem) {
                let chip = this.checkedItem.getComponent('BetChip');
                chip && chip.setLblColor(app.const.COLOR_WHITE);
            }
            this.checkedItem = event.target;
        });

    }

    setLblOptions(roomBet) {
        this.chips = [];
        this.node.children.filter((child) => ~child.name.indexOf('chip')).forEach((child, index) => {
            let amount = MULTIPLES[index] * Number(roomBet);
            let betChip = child.getComponent('BetChip');
            betChip && betChip.setChipAmountLbl(amount);
            this.chips.push(betChip);
        });
    }

    getCheckedItem() {
        return this.checkedItem;
    }

    getChip() {
        return this.getCheckedItem().getComponent('BetChip').getChipIcon(cc.size(25, 25));
    }

    getChipByAmount(amount) {
        // let chipComponent = this.chips.find((chip) => chip.amount >= amount);
        // let maxAmountOfChip = Math.max.apply(Math,this.chips.map(function(chip){return chip.amount;}))
        // if(!chipComponent && amount >= maxAmountOfChip)
        //     chipComponent = this.chips.find((chip) => chip.amount == maxAmountOfChip);
            
        // let chip = chipComponent && chipComponent.getChipIcon(cc.size(25, 25));
        
        let closest = this.chips.sort( (a, b) => Math.abs(amount - a.amount) - Math.abs(amount - b.amount) )[0];
        let chipComponent = this.chips.find((chip) => chip.amount == closest.amount);
            
        let chip = chipComponent && chipComponent.getChipIcon(cc.size(25, 25));
        
        return chip || this.getChip();
    }

    getChipIndexByAmount(amount, minBet) {
        return minBet > 0 ? MULTIPLES.indexOf(amount / minBet) : -1;
    }
}

app.createComponent(BetOptionsGroup);