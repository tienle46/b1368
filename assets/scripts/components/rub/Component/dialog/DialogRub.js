import TabRub from 'TabRub';
import Rub from 'Rub';
import app from 'app';
import RubUtils from 'RubUtils';
import NodeRub from 'NodeRub';

export default class DialogRub extends Rub {
    /**
     * Creates an instance of DialogRub.
     * 
     * @param {cc.Node} node
     * @param {object} tabOptions
     *  {
     *      tabs: [],   // its props exactly the same with options param in TabRub
     *      options : {} // its props exactly the same with options param in TabRub
     *  }
     * 
     * @memberOf DialogRub
     */
    constructor(node, tabOptions = null, isAddToNode = true) {
        super(node);
        // this.node = node;
        this.tabOptions = tabOptions;
        this.init();
        this.isAddToNode = isAddToNode;
    }

    init() {
        let dialog = app.res.prefab.dialog;
        this.prefab = cc.instantiate(dialog);
        this.prefab.zindex = app.const.dialogZIndex;
        this.addToNode();

        this.prefab.x = 0;
        this.prefab.y = 0;

        this.dialogNode = this.prefab.getChildByName('dialog');
        this.bodyNode = this.dialogNode.getChildByName('body');

        // event registeration
        this._closeBtnEventRegister();

        this.tabOptions && this._initTab(this.tabOptions);
    }

    // add Tab to prefab/pagination node
    _initTab(tabOptions) {
        let paginationNode = this.dialogNode.getChildByName('pagination');

        // add Tab
        let tabs = tabOptions.tabs;
        let options = tabOptions.options;

        new TabRub(paginationNode, this.bodyNode, tabs, options).fitToParent();
    }

    // close Btn Event
    _closeBtnEventRegister() {
        this.closeBtnNode = this.dialogNode.getChildByName('close_btn');

        this.closeBtnNode.on(cc.Node.EventType.TOUCH_END, (() => {
            this.prefab.removeFromParent(true);
        }).bind(this));
    }

    /**
     * add body to dialog
     * 
     * @param {cc.Node || string} node || prefab directory
     * 
     * @memberOf DialogRub
     */
    addBody(node) {
        let widget = {
            top: 140,
            left: 90,
            right: 90,
            bottom: 50
        };

        NodeRub.addWidgetComponentToNode(this.bodyNode, widget);

        if (node instanceof cc.Node) {
            this.bodyNode.addChild(node);
        } else {
            RubUtils.loadRes(node).then((prefab) => {
                let n = cc.instantiate(prefab);
                this.bodyNode.addChild(n);
            });
        }
    }

    addComponent(component) {
        return (!this.prefab.getComponent(component)) && this.prefab.addComponent(component);
    }


    // return tabRub
    static show(node, tabOptions) {
        return new this(node, tabOptions);
    }
}