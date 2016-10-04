import SegmentControlRub from 'SegmentControlRub';
import Tab from 'Tab';

export default class TabRub extends SegmentControlRub {
    /**
     * Creates an instance of TabRub.
     * 
     * @param {any} node
     * @param {any} bodyNode
     * @param {any} segments
     * @param {any} [options={}]
     *  {
     *  ...
     *  tabBodyPrefabType: string // name of folder that placed in prefab/dialog folder to load prefabs inside
     *  }
     * @memberOf TabRub
     */
    constructor(node, bodyNode, segments, options = {}) {
        super(node, segments, options);
        this.bodyNode = bodyNode;

        let url = 'dashboard/dialog/prefabs/';
        this.options.tabBodyPrefabUrl = this.options.hasOwnProperty('tabBodyPrefabType') ? `${url}${this.options.tabBodyPrefabType}/` : `${url}topup/`;
    }

    init() {
        // data == null
        return super.init().then((toggleGroup) => {
            this.tabComponent = this.prefab.addComponent(Tab);
            this.tabComponent.node.on('check-event', this._tabEventHandler.bind(this));
            return this;
        });
    }

    _tabEventHandler(event) {
        this.addContentPrefabToBody();
    }

    addContentPrefabToBody() {
        let activeTab = this.getVal();
        let prefabURL = `${this.options.tabBodyPrefabUrl}${activeTab}`;
        return this.tabComponent.addContentPrefabToBody(this.bodyNode, prefabURL);
    }

    getVal() {
        return this.tabComponent.getToggleGroup().getVal();
    }

    //override
    static show(node, bodyNode, segments, options) {
        return new TabRub(node, bodyNode, segments, options).init();
    }
}