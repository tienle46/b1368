import Component from 'Component';

export default class HistoricalTable extends Component {
    constructor() {
        super();
        
        this.properties = this.assignProperties({
            tableNode: cc.Node,
            childItem: cc.Node
        });
    }

    onLoad() {
        super.onLoad();
    }
    
    updateTableInfo(infors) {
        //clear table
        // this.tableNode.children.map((child, i) => i > 0 && child.destroy());
        this.tableNode.removeAllChildren();
        
        infors.forEach((data) => this.tableNode.addChild(this.modifyItem(data)));
    }
    
    /**
     * @interface
     * @return cc.Node
     */
    modifyItem() {}
}