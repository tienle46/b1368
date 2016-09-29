import RubUtils from 'RubUtils';
import TabRub from 'TabRub';
import Rub from 'Rub';

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
    constructor(node, tabOptions) {
        super(node);
        // this.node = node;
        this.tabOptions = tabOptions;
    }

    init() {
        return RubUtils.loadPrefab('dashboard/dialog/prefabs/dialog').then((prefab) => {
            this.prefab = cc.instantiate(prefab);

            this.prefab.x = 0;
            this.prefab.y = 0;

            this.addToNode();

            this.dialogNode = this.prefab.getChildByName('dialog');
            return null;
        }).then(() => {
            return this._initTab(this.tabOptions);
        });
    }

    // add Tab to prefab/pagination node
    _initTab(tabOptions) {
        let paginationNode = this.dialogNode.getChildByName('pagination');
        let bodyNode = this.dialogNode.getChildByName('body');

        // add Tab
        let tabs = tabOptions.tabs;
        let options = tabOptions.options;

        return TabRub.show(paginationNode, bodyNode, tabs, options).then((tabRub) => {
            tabRub.prefab.x = 0;
            tabRub.prefab.y = 0;
            tabRub.prefab.getChildByName('bg').height = 40;

            return tabRub;
        }).then((tabRub) => {
            return tabRub.addContentPrefabToBody();
        });
    }

    static show(node, tabOptions) {
        console.log("XXXX");
        return new this(node, tabOptions).init();
    }
}