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
        return super.init().then(() => {
            this.tabComponent = this.prefab.addComponent(Tab);
            this.prefab.setPosition(cc.v2(0, 0));
            this.tabComponent.node.on('check-event', this._tabEventHandler.bind(this));
            return null;
        }).then(this._tabEventHandler.bind(this));
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

    fitToParent(parentNode) {
        if (this.prefab) {
            this.prefab.setContentSize(parentNode.getContentSize());

            let widget = this.prefab.getComponent(cc.Widget) || this.prefab.addComponent(cc.Widget);
            widget.isAlignOnce = false;

            widget.isAlignTop = true;
            widget.isAlignBottom = true;
            widget.isAlignRight = true;
            widget.isAlignLeft = true;

            widget.left = 0;
            widget.right = 0;
            widget.top = 0;
            widget.bottom = 0;
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

        return this;
    }

    _isNode() {
        return this.getVal() instanceof cc.Node || this.getVal() instanceof Promise;
    }
}