import app from 'app';
import Component from 'Component';
import RubUtils from 'RubUtils';

export class GridView extends Component {
    constructor() {
        super();

        this.properties = {
            cellPrefab: cc.Prefab,
            rowPrefab: cc.Prefab
        };

        this.options = {};
    }

    // [[]|[]|[]]
    // [{}, {}, {}]
    init(head, body, options) {
        this.options = options;
        if (this.options.size) {
            let size = this.options.size;
            this.node.setContentSize(size);
        }

        this._initHead(head);
        this._initBody(body);
    }

    updateView(head, data) {
        if (this.node.children) {
            this.node.children.map(child => child.destroy() && child.removeFromParent());
        }

        this._initHead(head);
        this._initBody(data);
    }

    // {data: [], options: {}}
    _initHead(head) {
        let data = app._.isArray(head) ? head : (head.data || []);
        if (!app._.isEmpty(data)) {
            this._initRow(data, head.options);
        }
        head.length = 0;
    }

    _initBody(data) {
        if (!app._.isEmpty(data)) {
            data.map(D => {
                this._initRow(D);
            });
        }
        data.length = 0;
    }

    _initRow(data, options = {}) {
        let widths = this._setCellSize(data);
        let row = cc.instantiate(this.rowPrefab);
        row.getComponent('Row').init(data.map((d, i) => {
            let cell = cc.instantiate(this.cellPrefab);
            let cellComponent = cell.getComponent('Cell');
            if (cellComponent) {
                cellComponent.init(d, options);
                cellComponent.setWidth(widths[i]);
            }
            return cell;
        }));
        this.node.addChild(row);
    }

    _setCellSize(data) {
        let numberOfColumns = app._.isEmpty(data) ? 0 : data.length; // converted this.data 
        let groupWidth = (this.options.group && this.options.group.widths) || new Array(numberOfColumns).fill(null);
        let padding = 0;
        let spacingX = 0;
        let parentWidth = this.node.getContentSize().width;
        return RubUtils.calcWidthByGroup(parentWidth, groupWidth, spacingX, padding);
    }
}

app.createComponent(GridView);