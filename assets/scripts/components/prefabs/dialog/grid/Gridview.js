import app from 'app';
import Component from 'Component';

export class GridView extends Component {
    constructor() {
        super();

        this.properties = {
            cellPrefab: cc.Prefab,
            rowPrefab: cc.Prefab
        };

        this.options = {};
    }

    onDestroy() {
        this.options = null;
        super.onDestroy();
    }

    // [[]|[]|[]]
    // [{}, {}, {}]
    init(head, body, options) {
        this.options = options;
        if (this.options.size) {
            let size = this.options.size;
            this.node.setContentSize(size);
        }
        let hasHeader = false;
        
        head && (hasHeader = true) && this._initHead(head);
        body && this._initBody(body, this.options, hasHeader);
    }

    initList(data, options) {
        this.options = options;
        if (this.options.size) {
            let size = this.options.size;
            this.node.setContentSize(size);
        }
        
        data.map((D, i) => {
            this._initListRow(D, i % 2 !== 0);
        });
    }

    updateList(data, options) {
        if (this.node.children) {
            this.node.children.map(child => child.destroy() && child.removeFromParent());
        }
        cc.log('updating list......')
        data.map((D, i) => {
            this._initListRow(D, i % 2 !== 0);
        });
    }

    updateView(head, data) {
        if (this.node.children) {
            this.node.children.map(child => child.destroy() && child.removeFromParent());
        }
        cc.log('updating view......')
        head && this._initHead(head);
        data && this._initBody(data, this.options);
    }
    
    
    calcWidthByGroup (parentWidth, widths = [], spaceX = 0) {
        // parentWidth -= 2 * padding;
        // ['', '10%', 30, '']
        widths = widths.map((width) => {
            let w;

            if (width) {
                if (!isNaN(Number(width))) {
                    w = Number(width);
                } else {
                    if (width.indexOf('%') > 0) {
                        w = Number(width.replace('%', '')) * parentWidth / 100;
                    } else
                        w = null;
                }
                if (w && w < 0)
                    w = null;
            } else
                w = null;

            return w;
        }); // => [null, 10*parentWidth/100, 30, null]

        // total width inside array
        let totalWidth = widths.reduce((p, n) => !isNaN(p) && (Number(p) + Number(n)), 0);

        // remaing array which cotains null -> ["", null...]
        let remains = widths.filter((e) => !isNaN(e) && Number(e) === 0).length;

        // remaining width for null array, it will be equally divided.
        let n = parentWidth > totalWidth ? parentWidth - totalWidth : 0;
        let equallyDivided = n / remains;

        return widths.map((e) => {
            let number = ((e === null && Number(e) === 0 && equallyDivided) || e) - spaceX;
            return number > 0 ? number : 0;
        });
    }
    
    
    _initListRow(data, showBg) {
        let row = cc.instantiate(this.rowPrefab);
        row.getComponent('Row').initWithNode(data, showBg);
        this.addNode(row);
        this.node.addChild(row);
    }

    // {data: [], options: {}}
    _initHead(head) {
        let data = app._.isArray(head) ? head : (head.data || []);
        if (!app._.isEmpty(data)) {
            this._initRow(data, false, head.options);
        }
    }

    _initBody(data, options, hasHeader) {
        if (!app._.isEmpty(data)) {
            data.map((D, i) => {
                this._initRow(D, hasHeader ? i % 2 == 0 : i % 2 != 0, options);
            });
        }
    }

    _initRow(data, showBg, options = {}) {
        let widths = this._setCellSize(data);
        let row = cc.instantiate(this.rowPrefab);
        row.active = false;
        this.addNode(row);
        this.node.addChild(row);
        
        let rowComponent = row.getComponent('Row');
        rowComponent.init(data.map((d, i) => {
            let cell = cc.instantiate(this.cellPrefab);
            let cellComponent = cell.getComponent('Cell');
            if (cellComponent) {
                let o = {};
                options.fontColor && (o.fontColor = options.fontColor);
                options.fontSize && (o.fontSize = options.fontSize);

                if (options.group && options.group.colors) {
                    cellComponent.setColor(options.group.colors[i]);
                }

                cellComponent.init(d, o);
                cellComponent.setWidth(widths[i]);
            }
            this.addNode(cell);

            return cell;
        }), showBg);
    }

    _setCellSize(data) {
        let numberOfColumns = app._.isEmpty(data) ? 0 : data.length; // converted this.data 
        let groupWidth = (this.options.group && this.options.group.widths) || new Array(numberOfColumns).fill(null);
        let padding = 0;
        let spacingX = 0;
        let parentWidth = this.node.getContentSize().width;
        return this.calcWidthByGroup(parentWidth, groupWidth, spacingX, padding);
    }
}

app.createComponent(GridView);