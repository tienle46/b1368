// /**
//  * ToggleGroup
//  * Behaves as radion buttons in a group.
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
        }
    }

    updateToggles(toggle) {
        this.toggleItem.forEach((item) => {
            if (toggle.isChecked) {
                if (item !== toggle && item.isChecked && item.enabled) {
                    item.isChecked = false;
                }
            }
        });
    }


    _allowOnlyOneToggleChecked() {
        var isChecked = false;
        this.toggleItem.forEach((item) => {
            if (!item._toggleGroup) {
                item._toggleGroup = this;
            }

            if (isChecked && item.enabled) {
                item.isChecked = false;
            }

            if (item.isChecked && item.enabled) {
                isChecked = true;
            }
        });
    }

    onLoad() {
        //only allow one toggle to be checked
        this._allowOnlyOneToggleChecked();
    }
}

app.createComponent(ToggleGroup);