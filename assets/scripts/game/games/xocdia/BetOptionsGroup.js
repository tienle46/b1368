import app from 'app';
import Component from 'Component';

class BetOptionsGroup extends Component {
    constructor() {
        super();

        this.checkedItem = null;
    }

    onLoad() {
        this.node.on('chip-checked', (event) => {
            event.stopPropagation();
            this.checkedItem = event.target;
            console.debug(this.checkedItem);
        });
    }

    getCheckedItem() {
        return this.checkedItem;
    }
}

app.createComponent(BetOptionsGroup);