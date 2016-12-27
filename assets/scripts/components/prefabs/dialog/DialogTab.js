/**
 * Tab - handling toggleGroup behaves as tabs
 */
import app from 'app';
import Component from 'Component';

class DialogTab extends Component {
    constructor() {
        super();

        this.tabNode = {
            default: null,
            type: cc.Node
        };

        this.tabLbl = {
            default: null,
            type: cc.Label
        };

        this.dialogNode = {
            default: null,
            type: cc.Node
        };
    }

    onLoad() {
        super.onLoad();
        this.node.on('touchstart', function() {
            return;
        });
        this.dialogComponent = this.dialogNode.getComponent('Dialog');
    }

    make({ title, value, isChecked }) {
        this.tabLbl.string = title;

        let tab = cc.instantiate(this.tabNode);

        let toggle = tab.getComponent(cc.Toggle);
        toggle && (toggle.isChecked = isChecked);
        toggle && (toggle.value = value);

        tab.active = true;

        this.tabNode.parent.addChild(tab);

        if (isChecked)
            this.onCheckedEvent(toggle);
    }

    getCheckedItem() {
        return this.node.children.find((child) => {
            let toggle = child.getComponent(cc.Toggle);
            return toggle && toggle.isChecked;
        });
    }

    getCheckedItemValue() {
        return this.getCheckedItem().value;
    }

    // e: cc.Toggle
    onCheckedEvent(e) {
        let id = e.__instanceId;
        let value = e.value;

        if (value) {
            this.dialogComponent.addToBody(id, value);
        } else {
            this.dialogComponent.clearBody();
        }
    }
}

app.createComponent(DialogTab);