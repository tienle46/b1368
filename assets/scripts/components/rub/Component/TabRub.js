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
     *  isPrefab : boolean # indicates 
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
            return this;
        });
    }

    addContentPrefabToBody() {
        let url = 'dashboard/dialog/prefabs/';
        let tabBodyPrefabUrl = this.options.hasOwnProperty('tabBodyPrefabType') ? `${url}${this.options.tabBodyPrefabType}/` : `${url}topup/`;
        let activeTab = this.getVal();
        let prefabURL = `${tabBodyPrefabUrl}${activeTab}`;
        return this.tabComponent.addContentPrefabToBody(this.bodyNode, prefabURL);
    }

    addContentNodeToBody(node) {
        console.log('try to add new node here !');
        // return this.tabComponent.addContentPrefabTobody(this.bodyNode, node);
        this.tabComponent.clearBody(this.bodyNode);
    }

    getVal() {
        return this.tabComponent.getToggleGroup().getVal();
    }

    //override
    static show(node, bodyNode, segments, options) {
        return new TabRub(node, bodyNode, segments, options).init();
    }


    _tabEventHandler(event) {
        if (this._segementIsNode(event.target)) {
            this.addContentNodeToBody();
        } else {
            this.addContentPrefabToBody();
        }
    }

    _segementIsNode(target) {
        return target.isNode || false;
    }
}