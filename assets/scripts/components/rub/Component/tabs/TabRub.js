import SegmentControlRub from 'SegmentControlRub';
import Tab from 'Tab';
import NodeRub from 'NodeRub';

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
        this.init();
    }

    init() {
        // data == null
        super.init();
        this.tabComponent = this.prefab.addComponent(Tab);
        this.prefab.setPosition(cc.v2(0, 0));
        this.tabComponent.node.on('check-event', this._tabEventHandler.bind(this));

        this._tabEventHandler();
    }

    addContentPrefabToBody() {
        let dir = 'dashboard/dialog/prefabs/';
        let tabBodyPrefabUrl = `${dir}${this.options.tabBodyPrefabType}/`;
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


    fitToParent() {
        if (this.prefab) {
            this.prefab.setContentSize(this.node.getContentSize());

            let widget = {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            };

            NodeRub.addWidgetComponentToNode(this.prefab, widget);
        }
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

    //override
    static show(node, bodyNode, segments, options) {

        return new TabRub(node, bodyNode, segments, options);
    }
}