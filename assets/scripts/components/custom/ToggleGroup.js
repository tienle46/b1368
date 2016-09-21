// /**
//  * ToggleGroup
//  * Behaves as radion group.
//  */

var app = require('app');
var Component = require('Component');
var CheckBox = require('./CheckBox');

class ToggleGroup extends Component {
    constructor() {
        super();
        this.toggleItem = {
            default: [],
            type: CheckBox
        };
    }

    ctor() {
        this._selectedItem = null;
    }

    onLoad() {
        //only allow one toggle to be checked
        this._allowOnlyOneToggleChecked();
        this.node.on('check-event', (event) => {
            this.updateToggles(event.target.getComponent(CheckBox));
        });
    }

    updateToggles(toggle) {
        // console.log('updateToggles');
        this.setCheckedItem(toggle);
        console.log('yyy');

        console.log(this.toggleItem);
        this.toggleItem.forEach((item) => {
            if (toggle.isChecked) {
                if (item !== toggle && item.isChecked && item.enabled) {
                    item.isChecked = false;
                }
            }
        });
    }

    getVal() {
        return this._selectedItem.getVal();
    }

    getCheckedIndex() {
        return this._selectedItem.index;
    }

    getCheckedItem() {
        return this._selectedItem;
    }

    setCheckedItem(item) {
        console.log(item);

        this._selectedItem = item;
    }

    getItems() {
        return this.toggleItem;
    }

    addItem(item) {
        console.log(this.getItems(), 'push');
        this.toggleItem.push(item);
    }

    _allowOnlyOneToggleChecked() {
        var isChecked = false;
        this.toggleItem.forEach((item, index) => {
            item.index = index;
            if (!item._toggleGroup) {
                item._toggleGroup = this;
            }

            if (isChecked && item.enabled) {
                item.isChecked = false;
            }

            if (item.isChecked && item.enabled) {
                isChecked = true;
                this.setCheckedItem(item);
                console.log(item.getVal());
            }
        });
    }
}

app.createComponent(ToggleGroup);