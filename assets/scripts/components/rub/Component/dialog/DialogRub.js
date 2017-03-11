import Rub from 'Rub';
import app from 'app';
import { destroy } from 'CCUtils';

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

        return this;
    }

    changeTab(tabIndex, data) {
        this.tabs.changeTab(tabIndex, data);
    }

    // add Tab to prefab/pagination node
    _initTab(tabs) {
        let Tabs = this.dialogComponent.tabs;
        // add Tab
        tabs.filter(tab => !tab.hasOwnProperty('hidden') || (tab.hidden !== true)).forEach((tab, index) => {
            tab.isChecked = (index === 0);
            Tabs.make(tab);
        });
        window.release(tabs);
    }

    _initTitle(string) {
        this.dialogComponent.setTitle(string);
    }

    release() {
        this.options = null;
        destroy(this.prefab);
        window.release(this.tabs);
    }

    /**
     * add body to dialog
     * 
     * @param {cc.Node || string} node || prefab directory
     * 
     * @memberOf DialogRub
     */
    addBody(asset, componentName) {
        this.dialogComponent.addToBody('eventFakerId', asset, componentName);
    }

    addComponent(component) {
        return (!this.dialogNode.getComponent(component)) && this.dialogNode.addComponent(component);
    }


    // return tabRub
    static show(node, tabs, options) {
        let rub = new this(node, tabs, options);
        window.free(rub);
    }
}