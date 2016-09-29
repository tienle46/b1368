import SegmentControlRub from 'SegmentControlRub';
import Tab from 'Tab';

export default class TabRub extends SegmentControlRub {
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

    _tabEventHandler(event) {
        this.addContentPrefabToBody();
    }

    addContentPrefabToBody() {
        let activeTab = this.getVal();
        let prefabURL = `dashboard/dialog/prefabs/topup/${activeTab}`;
        return this.tabComponent.addContentPrefabToBody(this.bodyNode, prefabURL);
    }

    getVal() {
        return this.tabComponent.getToggleGroup().getVal();
    }
}