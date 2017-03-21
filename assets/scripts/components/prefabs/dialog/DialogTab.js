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
            toggle.isChecked = true;
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
    onCheckedEvent(toggle, data) {
        let id = toggle.__instanceId;
        let value = toggle.value;
        let componentName = toggle.componentName;
        
        this._changeLblColorOutline(toggle);
        
        if (value) {
            this.dialogComponent.addToBody(id, value, componentName, this, data);
        } else {
            this.dialogComponent.clearBody();
        }
    }
    
    _changeLblColorOutline(toggle) {
        this.node.children.forEach(tabNode => {
            if(tabNode.active) {
                // change label outline's color by tab state
                let toggleComponent = tabNode.getComponent(cc.Toggle);
                let lbl = tabNode.getChildByName('lbl');
                if(lbl && toggleComponent) {
                    let lblComponent = lbl.getComponent(cc.LabelOutline);
                    lblComponent.color = toggle == toggleComponent ? new cc.Color(147, 110, 0) : new cc.Color(1, 106, 181);
                }
            }
        });
        
    }
}

app.createComponent(DialogTab);