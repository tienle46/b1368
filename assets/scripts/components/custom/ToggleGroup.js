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
        this._checkedIndex = null;
    }

    updateToggles(toggle) {
        this.toggleItem.forEach((item, index) => {
            if (toggle.isChecked) {
                if (item !== toggle && item.isChecked && item.enabled) {
                    item.isChecked = false;
                }
                if (item === toggle) {
                    this._setCheckedIndex(index);
                }
            }
        });
    }

    onLoad() {
        //only allow one toggle to be checked
        this._allowOnlyOneToggleChecked();
    }

    // get index of activation tab
    getCheckedIndex() {
        return this._checkedIndex;
    }

    setCheckedIndexByItem(checkbox) {
        this.toggleItem.forEach((item, i) => {
            if (item === checkbox) {
                this._setCheckedIndex(i);
            }
        });

        return this.getCheckedIndex();
    }

    _allowOnlyOneToggleChecked() {
        var isChecked = false;
        this.toggleItem.forEach((item, index) => {
            if (!item._toggleGroup) {
                item._toggleGroup = this;
            }

            if (isChecked && item.enabled) {
                item.isChecked = false;
            }

            if (item.isChecked && item.enabled) {
                isChecked = true;
                this._setCheckedIndex(index);
            }
        });
    }


    _setCheckedIndex(index) {
        this._checkedIndex = index;
    }
}

app.createComponent(ToggleGroup);