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

        this.toggle = null;
    }

    onLoad() {
        super.onLoad();
        this.node.on('touchstart', function() {
            return;
        });
        this.dialogComponent = this.dialogNode.getComponent('Dialog');
    }


    make({ title, value, isChecked, componentName }) {
        this.tabLbl.string = title;

        let tab = cc.instantiate(this.tabNode);
        let toggle = tab.getComponent(cc.Toggle);
        if (toggle) {
            toggle.isChecked = isChecked;
            toggle.value = value;
            toggle.componentName = componentName;
        }

        tab.active = true;

        this.tabNode.parent.addChild(tab);

        this.addNode(tab);

        if (isChecked)
            this.onCheckedEvent(toggle);
    }

    changeTab(tabIndex, data) {
        let tab = this.node.children[tabIndex];
        if (tab) {
            let toggle = tab.getComponent(cc.Toggle);
            toggle.check();
            this.onCheckedEvent(toggle, data);
        }
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
    onCheckedEvent(e, data) {
        let id = e.__instanceId;
        let value = e.value;
        let componentName = e.componentName;

        if (value) {
            console.debug('id', id);
            this.dialogComponent.addToBody(id, value, componentName, this, data);
        } else {
            this.dialogComponent.clearBody();
        }
    }
}

app.createComponent(DialogTab);