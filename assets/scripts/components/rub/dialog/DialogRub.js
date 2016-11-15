import RubUtils from 'RubUtils';
import TabRub from 'TabRub';
import Rub from 'Rub';
import app from 'app';

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
    constructor(node, tabOptions = null) {
        super(node);
        // this.node = node;
        this.tabOptions = tabOptions;
    }

    init() {
        let dialog = app.res.prefab.dialog;
        this.prefab = cc.instantiate(dialog);
        this.addToNode();

        this.prefab.zIndex = 20;
        this.prefab.x = 0;
        this.prefab.y = 0;

        this.dialogNode = this.prefab.getChildByName('dialog');

        // event registeration
        this._closeBtnEventRegister();

        this.tabOptions && this._initTab(this.tabOptions);
    }

    // add Tab to prefab/pagination node
    _initTab(tabOptions) {
        let paginationNode = this.dialogNode.getChildByName('pagination');
        this.bodyNode = this.dialogNode.getChildByName('body');

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

    // return tabRub
    static show(node, tabOptions) {
        return new this(node, tabOptions).init();
    }
}