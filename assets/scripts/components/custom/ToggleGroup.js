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
        console.log('toggle onload');

        //only allow one toggle to be checked
        this._allowOnlyOneToggleChecked();
        this.node.on('check-event', (event) => {
            console.log("TOGGLE GET CMNR NE");
            console.log(this.toggleItem.length);
            this.updateToggles(event.target.getComponent(CheckBox));
            console.log(`val ${this.getVal()}`);
        });
        this.node.on('check-event2', (event) => {
            console.log("EVENT 2");
            console.warn(event);
        });
    }

    updateToggles(toggle) {
        // console.log('updateToggles');
        this.setCheckedItem(toggle);

        // console.log(this.toggleItem);
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
        // sure that only one item is checked 
        this._allowOnlyOneToggleChecked();
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
            }
        });
    }
}

app.createComponent(ToggleGroup);