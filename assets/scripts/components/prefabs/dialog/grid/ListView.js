import app from 'app';
import Component from 'Component';
import CCUtils, {clearAllChildren} from 'CCUtils';

export class ListView extends Component {
    constructor() {
        super();

        this.properties = {
            rowPrefab: cc.Prefab
        };

        this.options = {};
    }

    onDestroy() {
        this.options = null;
        super.onDestroy();
    }
    
    /**
     * 
     * @param {Array} nodes : Node Array
     * @param {any} options 
     * 
     * @memberOf ListView
     */
    init(nodes, options) {
        this.options = options;
        // if (this.options.size) {
        //     let size = this.options.size;
        //     this.node.setContentSize(size);
        // }
        nodes && this._initList(nodes);
    }

    _initList(nodes) {
        nodes.map((D, i) => {
            this._initListRow(D, i % 2 !== 0);
        });
    }

    updateList(nodes, options) {
        clearAllChildren(this.node);
        
        this.init(nodes, options);
    }

    _initListRow(data) {
        let row = cc.instantiate(this.rowPrefab);
        this.node.addChild(row);

        row.getComponent('Row').initWithNode(data);
        this.addNode(row);
    }
}

app.createComponent(ListView);