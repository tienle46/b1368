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

        head && this._initHead(head);
        body && this._initBody(body);
    }

    initList(data, options) {
        this.options = options;
        if (this.options.size) {
            let size = this.options.size;
            this.node.setContentSize(size);
        }

        data.map((D, i) => {
            this._initListRow(D, i % 2 == 0);
        });
    }

    updateList(data, options) {
        if (this.node.children) {
            this.node.children.map(child => child.destroy() && child.removeFromParent());
        }

        data.map((D, i) => {
            this._initListRow(D, i % 2 == 0);
        });
    }

    updateView(head, data) {
        if (this.node.children) {
            this.node.children.map(child => child.destroy() && child.removeFromParent());
        }

        head && this._initHead(head);
        data && this._initBody(data);
    }

    _initListRow(data, hideBg) {
        let row = cc.instantiate(this.rowPrefab);
        row.getComponent('Row').initWithNode(data, hideBg);
        this.node.addChild(row);
    }

    // {data: [], options: {}}
    _initHead(head) {
        let data = app._.isArray(head) ? head : (head.data || []);
        if (!app._.isEmpty(data)) {
            this._initRow(data, false, head.options);
        }
    }

    _initBody(data) {
        if (!app._.isEmpty(data)) {
            data.map((D, i) => {
                this._initRow(D, i % 2 == 0);
            });
        }
    }

    _initRow(data, showBg, options = {}) {
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
        }), showBg);

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