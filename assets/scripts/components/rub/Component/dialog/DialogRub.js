import Rub from 'Rub';
import app from 'app';
import RubUtils from 'RubUtils';
import NodeRub from 'NodeRub';

export default class DialogRub extends Rub {
    /**
     * Creates an instance of DialogRub.
     * 
     * @param {cc.Node} node
     * @param {Array} tabs: array options
     *  {
     *      title: string # label text
     *      value: {any} # component value
     *  }
     * @param {options} 
     * {
     *      title: string
     * }
     * @memberOf DialogRub
     */
    constructor(node, tabs = null, options) {
        super(node);
        // this.node = node;
        /**
         *
         * @type {DialogTab}
         */
        this.tabs = tabs;
        this.options = options;

        this.init();
        options = null;
        tabs = null;
    }

    init() {
        let dialog = app.res.prefab.dialog;
        this.prefab = cc.instantiate(dialog);
        this.addToNode();

        this.prefab.x = 0;
        this.prefab.y = 0;

        this.dialogNode = this.prefab.getChildByName('dialog');
        this.dialogComponent = this.dialogNode.getComponent('Dialog');
        this.dialogComponent.addNode(this.prefab);
        this.bodyNode = this.dialogComponent.bodyNode;

        this.tabs && this._initTab(this.tabs);
        this.options.title && this._initTitle(this.options.title);
        this.options = null;
    }

    changeTab(tabIndex, data){
        this.tabs.changeTab(tabIndex, data);
    }

    // add Tab to prefab/pagination node
    _initTab(tabs) {
        let Tabs = this.dialogComponent.tabs;
        // add Tab
        tabs.forEach((tab, index) => {
            tab.isChecked = (index === 0);
            Tabs.make(tab, this);
        });
        tabs = null;
    }

    _initTitle(string) {
        this.dialogComponent.setTitle(string);
    }

    addComponent(component) {
        return (!this.prefab.getComponent(component)) && this.prefab.addComponent(component);
    }


    // return tabRub
    static show(node, tabs, options) {
        return new this(node, tabs, options);
    }
}