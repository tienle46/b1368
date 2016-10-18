import RubUtils from 'RubUtils';
import app from 'app';

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
     *  horizontalSeparate: {
     *      pattern: string || cc.Color,
     *      size: cc.size(),
     *      align: string # 'left' | 'full' | 'right' | 'none' # default 'full'
     *  }
     *  verticalSeparate: {
     *      pattern: string || cc.Color,
     *      size: cc.size(),
     *      align: string # 'top' | 'full' | 'bottom' | 'none' # default 'full'
     *  }
     *  // TODO 
     *  button & clickEvent handler when cell contains button. button with/without label
     * }
     * @memberOf CellRub 
     */
    constructor(text, opts = {}) {
        let defaultOptions = {
            bgColor: app.const.COLOR_VIOLET, // # violet
            width: 100,
            height: 50,
            fontColor: app.const.COLOR_YELLOW, // # yellow
            fontSize: 16,
            fontLineHeight: 40,
            horizontalSeparate: null,
            verticalSeparate: null
        };

        this.options = Object.assign({}, defaultOptions, opts);

        this.text = text;
        this._initCell();
    }

    cell() {
        return this.cellNode;
    }

    // resettingHorizontalSeparate(width) {

    // }

    _initCell() {
        this.cellNode = new cc.Node();
        this.cellNode.name = 'cell';
        let size = cc.size(this.options.width, this.options.height);
        this.cellNode.setContentSize(size);

        let cellSprite = this.cellNode.addComponent(cc.Sprite);
        RubUtils.loadSpriteFrame(cellSprite, this.options.spriteFrame || 'textures/50x50', size);

        if (!this.options.spriteFrame) {
            // fill color to sprite
            cellSprite.node.color = this.options.bgColor;
        }

        // init label
        this._initLabel(this.cellNode);

        // if hasHorizontalSeparate
        if (this.options.horizontalSeparate && this.options.horizontalSeparate.align !== 'none') {
            this._initHorizontalSeparate(this.cellNode);
        }
        // if hasVerticalSeparate
        if (this.options.verticalSeparate && this.options.verticalSeparate.align !== 'none') {
            this._initVerticalSeparate(this.cellNode);
        }
    }

    _initHorizontalSeparate(parentNode) {
        this.horizontalSeparateNode = new cc.Node();
        this.horizontalSeparateNode.setPosition(cc.v2(0, 0));

        let nodeSize = this.options.horizontalSeparate.size || cc.size(parentNode.getContentSizeX(), 2); // width: cellWidth, height: 2px
        this.horizontalSeparateNode.setContentSize(nodeSize);

        let nodeSprite = this.horizontalSeparateNode.addComponent(cc.Sprite);
        RubUtils.loadSpriteFrame(nodeSprite, typeof this.options.horizontalSeparate.pattern === 'string' ? this.options.horizontalSeparate.pattern : 'textures/50x50', nodeSize, false, (sprite) => {
            if (this.options.horizontalSeparate.pattern instanceof cc.Color) {
                sprite.node.color = this.options.horizontalSeparate.pattern;
            }
        });

        let nodeWidget = this.horizontalSeparateNode.addComponent(cc.Widget);
        nodeWidget.isAlignOnce = false;
        nodeWidget.isAlignBottom = true;
        nodeWidget.bottom = 0;
        switch (this.options.horizontalSeparate.align) {
            case 'left':
                nodeWidget.isAlignLeft = true;
                nodeWidget.left = 0;
                break;
            case 'right':
                nodeWidget.isAlignRight = true;
                nodeWidget.right = 0;
                break;
            default:
                nodeWidget.isAlignLeft = true;
                nodeWidget.isAlignRight = true;
                nodeWidget.left = 0;
                nodeWidget.right = 0;
                break;
        }


        parentNode.addChild(this.horizontalSeparateNode);
    }

    _initVerticalSeparate(parentNode) {

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