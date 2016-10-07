import RubUtils from 'RubUtils';

export default class CellRub {
    /**
     * Creates an instance of CellRub (instance of cc.Node also).
     * 
     * @param {any} node
     * @param {any} [options={}]
     * {
     *  spriteFrame: string
     *  bgColor: new cc.Color
     *  width: number
     *  height: number
     *  fontColor: new cc.Color
     *  fontSize: number
     *  fontLineHeight: number
     *  // TODO 
     *  button & clickEvent handler when cell contains button. button with/without label
     * }
     * @memberOf CellRub 
     */
    constructor(text, opts = {}) {
        let defaultOptions = {
            bgColor: new cc.Color(68, 25, 97), // # violet
            width: 100,
            height: 50,
            fontColor: new cc.Color(246, 255, 41), // # yellow
            fontSize: 16,
            fontLineHeight: 40
        };

        this.options = Object.assign({}, defaultOptions, opts);

        this.text = text;
    }

    cell() {
        return this._initCell();
    }

    _initCell() {
        let cellNode = new cc.Node();
        cellNode.name = 'cell';
        let size = cc.size(this.options.width, this.options.height);
        cellNode.setContentSize(size);

        let cellSprite = cellNode.addComponent(cc.Sprite);
        RubUtils.loadSpriteFrame(cellSprite, this.options.spriteFrame || 'textures/50x50', size);

        if (!this.options.spriteFrame) {
            // fill color to sprite
            cellSprite.node.color = this.options.bgColor;
        }

        // init label
        this._initLabel(cellNode);

        return cellNode;
    }

    _initLabel(parentNode) {
        let lblNode = new cc.Node();
        lblNode.setContentSize(parentNode.getContentSize());

        let lbl = lblNode.addComponent(cc.Label);
        lbl.string = this.text;
        lbl.node.color = this.options.fontColor;
        lbl.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
        lbl.verticalAlign = cc.Label.VerticalAlign.CENTER;
        lbl.fontSize = this.options.fontSize;
        lbl.lineHeight = this.options.fontLineHeight;
        lbl.overflow = cc.Label.Overflow.RESIZE_HEIGHT;

        parentNode.addChild(lblNode);
    }
}