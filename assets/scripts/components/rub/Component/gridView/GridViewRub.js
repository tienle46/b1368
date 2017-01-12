import RubUtils from 'RubUtils';
import CellRub from 'CellRub';
import app from 'app';
import NodeRub from 'NodeRub';
import ScrollViewRub from 'ScrollViewRub';

export default class GridViewRub extends ScrollViewRub {
    /**
     * Creates an instance of GridViewRub.
     * 
     * @head {Array || null } table header array
     * {
     *  data: ['text', 'text', 'text'] # string array represent for label text inside header
     *      # head.data.length must equal to length of @param {Array [[]]} data.length
     *  options: {...cellRub's options }
     * }
     * @param {Array [[]]} data # multiple string mapping array 
     * let data = [
     *  ['1', 2, 3], # colum 1                  1   |   a  |  c1
     *  ['a', 'b', 'c'], # column 2         =>  2   |   b  |  c2
     *  ['c1', 'c2', 'c3'], # column 3          3   |   c  |  c3
     *  ... # column N
     * ];
     *  or
     *  ['1', '2', '3'],
     *  [{obj}, {obj}, {obj}]
     *  Therein {obj} are an object includes:
     *  {
     *      text: string # display string of label
     *      color: new cc.Color() # color of node which includes label above
     *      fontSize : number # number of fontSize, it has higher priority than opts.cell.fontSize
     *      fontLineHeight: number
     *      button: { # if this property is exist. Default a label will be contained inside button < if above `text` is availabe >
     *          spriteFrame: string,
     *          eventHandler: cc.Component.EventHandler,
     *          width: number # button width
     *          value: {any} // button's value
     *          height: number # button height
     *      }
     *  }
     * 
     * @param {any} opts
     * {
     *  bg: new cc.Color() || string: resource URL # `content` node background
     *  @required position: cc.v2() # default : cc.v2(0, 0);
     *  @required width: number # grid width 
     *  @required height: number # grid height
     *  @required spacingX: number # default 2px
     *  @required spacingY: number # default 2px
     *  dataValidated: boolean # sometimes we dont need to validate our getted data # default: false
     *  group: {
     *      widths: array[number || null] # array of width per cell ['', 500, 20]
     *          # assuming you have `content` node with width = 100 and 3 columns ['', 50, 20]
     *          # while the first element in array `width` is empty || null its width will be 100 - (50 + 20)
     *          # if we have width = ['', '', 50, 20] -> (100 - (50 + 20)) / 2
     *      colors: array[new cc.Color || null] # array of setting color of text. default cc.Color(225, 255, 255)
     *      events: array[ cc.Component.EventHandler || null] # only affected to all button or mapped by array position.
     *  }
     *  paging: {
     *      previous: cc.Component.EventHandler
     *      next: cc.Component.EventHandler
     *  }
     * 
     *  @required cell: { // CellRub options
     *      spriteFrame: string
     *      bgColor: new cc.Color
     *      width: number
     *      height: number
     *      font: cc.Font
     *      fontColor: new cc.Color
     *      fontSize: number
     *      fontLineHeight: number,
     *  }
     * }
     * 
     * @memberOf GridViewRub ( cc.Node )
     */
    constructor(head = null, data, opts = {}) {
        super(data, opts);
        // CellRub default options
        let cell = Object.assign({}, {
            width: 100,
            height: 80,
            fontColor: app.const.COLOR_WHITE,
            fontSize: 20,
            fontLineHeight: 25,
            font: 'fonts/newFonts/ICIELPANTON-BLACK'
        }, opts.cell || {});

        let defaultOptions = {
            cell
        };

        let defaultHead = {
            data: [],
        };

        // this.options = Object.assign({}, defaultOptions, opts);
        this.options = Object.assign(this.options, defaultOptions, opts);

        this.data = this.options.dataValidated ? data : this._validateData(data);

        if (head instanceof Array) {
            this.head = {
                data: head
            };
        } else {
            this.head = Object.assign({}, defaultHead, head);
        }

        this.init();
    }

    // Override
    init() {
        super.init();

        //init cell
        this.data.length > 0 && this.data[0] instanceof Array && this.data[0].length > 0 && this._initCell();
    }


    resetData(data, isValidated = false) {
        this.data = isValidated ? data : this._validateData(data);
        // reset body
        this.contentNode.children && this.contentNode.children.forEach(child => cc.isValid(child) && child.destroy() && child.removeFromParent());
        // reinsert
        this._initCell();
    }

    destroy() {
        super.destroy();
        this.head = null;
    }

    _setupComponentsByOptions(body) {
        super._setupComponentsByOptions(body);
        // content/layout
        let layout = {
            type: cc.Layout.Type.GRID,
            resizeMode: cc.Layout.ResizeMode.CONTAINER,
            startAxis: cc.Layout.AxisDirection.HORIZONTAL,
            verticalDirection: cc.Layout.VerticalDirection.TOP_TO_BOTTOM,
            horizontalDirection: cc.Layout.HorizontalDirection.LEFT_TO_RIGHT,
            spacingX: this.options.spacingX,
            spacingY: this.options.spacingY,
            padding: 0
        };

        NodeRub.addLayoutComponentToNode(this.contentNode, layout);
    }

    _initCell() {
        let data = this.data; // body data
        let headData = this.head.data;
        if (headData && headData.length > 0) {
            this._insertCellHead(data);
        }

        this._insertCellBody(data);
    }

    _insertCellHead(data) {
        let width = this._setCellSize(data);
        let headData = this.head.data;
        let cellOpts = Object.assign({}, this.options.cell, this.head.options || {});

        let rowHeight = cellOpts.height;

        let cellsInRow = [];
        for (let i = 0; i < headData.length; i++) {
            cellOpts.width = width[i];
            let cellRub = new CellRub(headData[i], cellOpts);
            rowHeight = rowHeight > cellRub.getHeight() ? rowHeight : cellRub.getHeight();
            cellsInRow.push(cellRub);
            this.contentNode && this.contentNode.addChild(cellRub.node());
        }

        if (rowHeight !== cellOpts.height && cellsInRow.length > 0) {
            for (let x = 0; x < cellsInRow.length; x++) {
                cellsInRow[x].resizeHeight(rowHeight);
            }
            cellsInRow = [];
        }
    }

    _insertCellBody(data) {
        let width = this._setCellSize(data);

        for (let i = 0; i < data.length; i++) {
            let rowHeight = this.options.cell.height;
            let cellsInRow = [];
            let isEven = i % 2 === 0;

            for (let j = 0; j < data[i].length; j++) {
                let cellOpts = Object.assign({}, this.options.cell);
                isEven && (cellOpts.spriteFrame = 'blueTheme/general/dialog/cell-bg');
                cellOpts.width = width[j];
                let cell = data[i][j];
                let isNode = cell instanceof cc.Node;
                if (!isNode) {
                    if (cell instanceof Object) {
                        if (cell.fontSize)
                            cellOpts.fontSize = cell.fontSize;
                        if (cell.fontLineHeight)
                            cellOpts.fontLineHeight = cell.fontLineHeight;
                    }

                    if (this.options.group) {
                        if (this.options.group.colors)
                            cellOpts.fontColor = this.options.group.colors[j] || app.const.COLOR_WHITE;

                        if (this.options.group.events) {
                            let event = this.options.group.events[j] || this.options.group.events[0] || null;
                            if (event) {
                                if (cell instanceof Object && cell.button && !cell.button.hasOwnProperty('eventHandler')) {
                                    cell.button.eventHandler = event;
                                }
                            }
                        }
                    }
                }

                // body
                let cellRub = new CellRub(cell, cellOpts);
                if (!isNode) {
                    rowHeight = rowHeight > cellRub.getHeight() ? rowHeight : cellRub.getHeight();
                    cellsInRow.push(cellRub);
                }

                this.contentNode && this.contentNode.addChild(cellRub.node());
            }

            if (rowHeight !== this.options.cell.height && cellsInRow.length > 0) {
                for (let x = 0; x < cellsInRow.length; x++) {
                    cellsInRow[x].resizeHeight(rowHeight);
                }
            }
        }
    }

    _setCellSize() {
        let numberOfColumns = this.data[0] ? this.data[0].length : 0; // converted this.data 
        let groupWidth = (this.options.group && this.options.group.widths) || new Array(numberOfColumns).fill(null);
        let padding = 0;
        let spacingX = this.options.spacingX;
        let parentWidth = this.getContentNodeWidth();
        return RubUtils.calcWidthByGroup(parentWidth, groupWidth, spacingX, padding);
    }

    /**
     * convert an array mapping to original array
     * let input = [
     *  ['content1', 'content2', 'content3'] # column 1
     *  ['value1', 'value2', 'value3'] # column 2
     *  ['any1', 'any2', 'any3'] # column 3
     *  [] # column 4
     * ]
     *  => 
     * output = [
     *  ['content1', 'value1', 'any1', ''],
     *  ['content2', 'value2', 'any2', ''],
     *  ['content3', 'value3', 'any3', '']
     * ]
     * @static
     * @param {Array} input
     * 
     * @memberOf GridViewRub
     */
    _validateData(input) {
        if (input instanceof Array && input.length < 1)
            return [];

        input = app._.cloneDeep(input);
        let tmp = [];
        let out = [];
        if (input[0])
            while (input[0].length > 0) {
                for (let i = 0; i < input.length; i++) {
                    tmp.push(input[i].shift() || null);
                }
                out.push(tmp);
                tmp = [];
            }

        return out;
    }

    // return Promise which attaches `cc.Node`
    static node(head, data, opts = {}) {
        return new GridViewRub(head, data, opts).getNode();
    }

    static show(node, head, data, opts = {}) {
        node.addChild(new GridViewRub(head, data, opts).getNode());
    }
}