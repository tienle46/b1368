import RubUtils from 'RubUtils';
import CellRub from 'CellRub';
import app from 'app';

export default class ListViewRub {
    constructor(head = null, data, opts = {}) {
        // CellRub default options
        let cell = Object.assign({}, {
            bgColor: app.const.COLOR_VIOLET, // # violet
            width: 100,
            height: 50,
            fontColor: app.const.COLOR_YELLOW, // # yellow
            fontSize: 16,
            fontLineHeight: 40,
            horizontalSeparate: null,
            verticalSeparate: null
        }, opts.cell || {});

        let defaultOptions = {
            position: cc.v2(0, 0),
            width: 585,
            height: 250,
            spacingX: 2,
            spacingY: 2,
            isHorizontal: false,
            isVertical: true,
            group: {},
            cell
        };

        let defaultHead = {
            data: [],
        };

        this.options = Object.assign({}, defaultOptions, opts);
        this.data = this._validData(data);
        if (head instanceof Array) {
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
        return this.contentNode && (() => this.contentNode.getContentSize().width || 0)();
    }

    getNode() {
        return this.init().then(() => {
            return this.prefab;
        });
    }

    resetData(data) {
        this.data = this._validData(data);
        // reset body
        this.contentNode && this.contentNode.removeAllChildren(true);
        // reinsert
        this._insertCellBody(this.data);
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
        let contentSprite = contentNode.getComponent(cc.Sprite);

        let size = contentNode.getContentSize();
        let defaultSpriteFrame = 'textures/50x50.png';
        RubUtils.loadSpriteFrame(contentSprite, typeof this.options.bg === 'string' ? this.options.bg : defaultSpriteFrame, size, false, () => {
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

        for (let i = 0; i < headData.length; i++) {
            cellOpts.width = width[i];
            let cellNode = new CellRub(headData[i] || '', cellOpts).node();
            this.contentNode.addChild(cellNode);
        }
    }

    _insertCellBody(data) {
        let width = this._setCellSize(data);


        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].length; j++) {
                let jMax = data[i].length - 1;
                let cellOpts = Object.assign({}, this.options.cell);
                cellOpts.width = width[j];
                if (this.options.group.colors)
                    cellOpts.fontColor = this.options.group.colors[j] || app.const.COLOR_WHITE;

                // add separate if any.   
                if (cellOpts.horizontalSeparate) {
                    let separateWidth = (j === 0 || j === jMax ? 80 : 100) * cellOpts.width / 100;
                    cellOpts.horizontalSeparate.size = cc.size(separateWidth, cellOpts.horizontalSeparate.size ? cellOpts.horizontalSeparate.size.height : 2);
                    if (j === 0)
                        cellOpts.horizontalSeparate.align = 'right';
                    else if (j === jMax)
                        cellOpts.horizontalSeparate.align = 'left';
                    else
                        cellOpts.horizontalSeparate.align = 'full';

                    if (i === data.length - 1)
                        cellOpts.horizontalSeparate.align = 'none';
                }

                // body
                let cellNode = new CellRub(data[i][j] || '', cellOpts).node();
                this.contentNode && this.contentNode.addChild(cellNode);
            }
        }
    }

    _setCellSize() {
        if (this.options.group.widths) {
            let groupWidth = this.options.group.widths;

            // total width inside array
            let totalWidth = groupWidth.reduce((p, n) => !isNaN(p) && (Number(p) + Number(n)));

            // remaing array which cotains null -> ["", ""]
            let remains = groupWidth.filter((e) => !isNaN(e) && Number(e) === 0);
            let n = this.getContentNodeWidth() > totalWidth ? this.getContentNodeWidth() - totalWidth : 0;

            return groupWidth.map((e) => (!isNaN(e) && Number(e) === 0 && n / remains.length - this.options.spacingX) || e - this.options.spacingX);

        } else {
            let numberOfColumns = this.data[0] ? this.data[0].length : 0; // converted this.data 
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
    static node(head, data, opts = {}) {
        return new ListViewRub(head, data, opts).init().then((a) => {
            return a._getNode();
        });
    }

}