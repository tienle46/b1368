import Rub from 'Rub';
import RubUtils from 'RubUtils';
import CellRub from 'CellRub';

export default class GridViewRub extends Rub {
    /**
     * Creates an instance of GridViewRub.
     * 
     * @param {any} node
     * @head {Array || object } table header array
     * {
     *  data: ['text', 'text', 'text'] # string array represent for label text inside header
     *      # head.data.length must equal to length of @param {Array [[]]} data.length
     *  options: {...cellRub's options }
     * }
     * @param {Array [[]]} data # multiple mapping array 
     * let data = [
     *  ['1', 2, 3], # colum 1                  1   |   a  |  c1
     *  ['a', 'b', 'c'], # column 2         =>  2   |   b  |  c2
     *  ['c1', 'c2', 'c3'], # column 3          3   |   c  |  c3
     *  ... # column N
     * ];
     * 
     * @param {any} opts
     * {
     *  bg: new cc.Color() || string: resource URL # `content` node background
     *  position: cc.v2() # default : cc.v2(0, 0);
     *  width: number # grid width
     *  height: number # grid height
     *  isHorizontal: boolean # default false
     *  isVertical: boolean # default true
     *  spacingX: number # default 2px
     *  spacingY: boolean # default 2px
     *  colWidth: array[number || null] # array of width per column ['', 500, 20]
     *      # assuming you have `content` node with width = 100 and 3 columns ['', 50, 20]
     *      # while the first element in array `colWidth` is empty || null its width will be 100 - (50 + 20)
     *      # if we have colWidth = ['', '', 50, 20] -> (100 - (50 + 20)) / 2
     *  event: cc.EventHandler || null # add a scroll event to scrollView
     *  cell: { // CellRub options
     *      spriteFrame: string
     *      bgColor: new cc.Color
     *      width: number
     *      height: number
     *      fontColor: new cc.Color
     *      fontSize: number
     *      fontLineHeight: number
     *      // TODO 
     *      button & clickEvent handler when cell contains button. button with/without label
     *  }
     * }
     * @memberOf GridViewRub
     */
    constructor(node, head = null, data, opts = {}) {
        super(node);
        // CellRub default options
        let cell = {
            bgColor: new cc.Color(68, 25, 97), // # violet
            width: 100,
            height: 50,
            fontColor: new cc.Color(246, 255, 41), // # yellow
            fontSize: 16,
            fontLineHeight: 40
        };

        let defaultOptions = {
            position: cc.v2(0, 0),
            width: 585,
            height: 250,
            spacingX: 2,
            spacingY: 2,
            isHorizontal: false,
            isVertical: true,
            cell
        };

        let defaultHead = {
            data: [],

        };

        this.options = Object.assign({}, defaultOptions, opts);
        this.data = this._validData(data);
        if (data instanceof Array) {
            this.head = {
                data: head
            };
        } else {
            this.head = Object.assign({}, defaultHead, head);
        }
    }

    init() {
        let scrollviewPrefab = 'dashboard/dialog/prefabs/scrollview';

        return RubUtils.loadRes(scrollviewPrefab).then((prefab) => {
            this.prefab = cc.instantiate(prefab);

            // this.addToNode();

            this.viewNode = this.prefab.getChildByName('view');
            this.contentNode = this.viewNode.getChildByName('content');

            return this.prefab;
        }).then((prefab) => {
            this._setupComponentsByOptions(prefab);

            return null;
        }).then(() => {
            // init cell
            this.data.length > 0 && this.data[0] instanceof Array && this.data[0].length > 0 && this._initCell();
            return this;
        });
    }

    getContentNodeWidth() {
        return this.contentNode.getContentSize().width;
    }

    getNode() {
        return this.init().then(() => {
            return this.prefab;
        });
    }

    updateData(data) {
        data = this._validData(data);
        // this.data = [...this.data, ...data];
        // this.prefab.active = false;
        this._insertCellBody(data);
    }

    _setupComponentsByOptions(prefab) {
        this._resize(prefab);

        // scrollview
        let scrollView = prefab.getComponent(cc.ScrollView);
        scrollView.horizontal = this.options.isHorizontal;
        scrollView.vertical = this.options.isVertical;
        // register scrollview scrollEvent
        scrollView.scrollEvents = [];
        this.options.event && scrollView.scrollEvents.push(this.options.event);

        // content/layout
        let contentLayout = this.contentNode.getComponent(cc.Layout);
        contentLayout.spacingX = this.options.spacingX;
        contentLayout.spacingY = this.options.spacingY;

        // setup content background
        this.options.bg && this._setupContent(this.contentNode);
    }

    _setupContent(contentNode) {
        // create spriteFrame
        let contentSprite = contentNode.addComponent(cc.Sprite);
        let size = contentNode.getContentSize();
        let defaultSpriteFrame = 'textures/50x50';
        RubUtils.loadSpriteFrame(contentSprite, typeof this.options.bg === 'string' ? this.options.bg : defaultSpriteFrame, size, (sprite) => {
            if (typeof this.options.bg !== 'string') {
                // set color to node
                contentNode.color = this.options.bg;
            }
        });
    }

    // resize content node by parent ( dont know why widget does not work )
    _resize(prefab) {
        prefab.setPosition(this.options.position);
        // set prefab size
        prefab.setContentSize(cc.size(this.options.width, this.options.height));
        // `view` node size
        this.viewNode.setContentSize(cc.size(this.options.width - 30, this.options.height));
        // `view/content` node size
        this.contentNode.setContentSize(this.viewNode.getContentSize());
    }

    _initCell() {
        let data = this.data;

        if (this.head.data && this.head.data.length > 0) {
            this._insertCellHead(data);
        }

        this._insertCellBody(data);
    }

    _insertCellHead(data) {
        let width = this._setCellSize(data);
        let cellOpts = Object.assign({}, this.options.cell, this.head.options || {});

        for (let i = 0; i < this.head.data.length; i++) {
            cellOpts.width = width[i];
            let cellNode = new CellRub(this.head.data[i] || '', cellOpts).cell();
            this.contentNode.addChild(cellNode);
        }
    }

    _insertCellBody(data) {
        let width = this._setCellSize(data);
        let cellOpts = Object.assign({}, this.options.cell);

        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].length; j++) {
                cellOpts.width = width[j];
                cellOpts.fontColor = new cc.Color(255, 255, 255);

                // body
                let cellNode = new CellRub(data[i][j] || '', cellOpts).cell();
                this.contentNode.addChild(cellNode);
            }
        }
    }
    _setCellSize() {
        if (this.options.colWidth) {
            let colWidth = this.options.colWidth;

            // total width inside array
            let totalWidth = colWidth.reduce((p, n) => !isNaN(p) && (Number(p) + Number(n)));

            // remaing array which cotains null -> ["", ""]
            let remains = colWidth.filter((e) => !isNaN(e) && Number(e) === 0);
            let n = this.getContentNodeWidth() > totalWidth ? this.getContentNodeWidth() - totalWidth : 0;

            return colWidth.map((e) => (!isNaN(e) && Number(e) === 0 && n / remains.length - this.options.spacingX) || e - this.options.spacingX);

        } else {
            let numberOfColumns = this.data[0].length; // converted this.data 
            return new Array(numberOfColumns).fill(0).map(() => this.getContentNodeWidth() / numberOfColumns - this.options.spacingX);
        }
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
    _validData(input) {
        let tmp = [];
        let out = [];
        while (input[0].length > 0) {
            for (let i = 0; i < input.length; i++) {
                tmp.push(input[i].shift() || null);
            }
            out.push(tmp);
            tmp = [];
        }

        return out;
    }

    _getNode() {
        return this.prefab;
    }


    // return Promise which attaches `cc.Node`
    static node(node, head, data, opts = {}) {
        return new GridViewRub(node, head, data, opts).init().then((a) => {
            return a._getNode();
        });
    }

}