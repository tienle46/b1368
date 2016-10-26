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
     *  tabBodyPrefabType: string # name of folder that placed in prefab/dialog folder to load prefabs inside
     *  }
     * @memberOf TabRub
     */
    constructor(node, bodyNode, segments, options = {}) {
        super(node, segments, options);
        this.bodyNode = bodyNode;
    }

    init() {
        // data == null
        return super.init().then((toggleGroup) => {
            this.tabComponent = this.prefab.addComponent(Tab);
            this.tabComponent.node.on('check-event', this._tabEventHandler.bind(this));
            return null;
        }).then(() => {
            this._tabEventHandler();
            return this;
        });
    }

    addContentPrefabToBody() {
        let url = 'dashboard/dialog/prefabs/';
        let tabBodyPrefabUrl = `${url}${this.options.tabBodyPrefabType}/`;
        let activeTab = this.getVal();
        let prefabURL = `${tabBodyPrefabUrl}${activeTab}`;
        return this.tabComponent.addContentPrefabToBody(this.bodyNode, prefabURL);
    }

    addContentNodeToBody() {
        this.tabComponent.addContentNodeToBody(this.bodyNode, this.getVal());
        // return this.tabComponent.addContentPrefabTobody(this.bodyNode, node);
    }

    getVal() {
        return this.tabComponent.getToggleGroup().getVal();
    }

    //override
    static show(node, bodyNode, segments, options) {
        return new TabRub(node, bodyNode, segments, options).init();
    }

    _tabEventHandler() {
        if (this.getVal() === null)
            return;
        if (this._isNode()) {
            this.addContentNodeToBody();
        } else {
            this.addContentPrefabToBody();
        }
    }

    _isNode() {
        return this.getVal() instanceof cc.Node || this.getVal() instanceof Promise;
    }
}