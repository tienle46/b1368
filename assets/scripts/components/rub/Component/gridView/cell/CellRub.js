import RubUtils from 'RubUtils';
import app from 'app';
import ButtonScaler from 'ButtonScaler';
import NodeRub from 'NodeRub';

export default class CellRub {
    /**
     * Creates an instance of CellRub (instance of cc.Node also).
     * 
     * @param text {string || {}} 
     * {
     *      text: string # display string of label
     *      button: { # if this property is exist. Default a label will be contained inside button < if above `text` is availabe >
     *          spriteFrame: string,
     *          eventHandler: cc.Component.EventHandler,
     *          width: number # button width
     *          value: {any} // button's value
     *          height: number # button height
     *      }
     *  }
     *  
     * @param {any} [options={}]
     * {
     *  spriteFrame: string
     *  bgColor: new cc.Color
     *  width: number
     *  height: number
     *  fontColor: new cc.Color
     *  font: cc.Font
     *  fontSize: number
     *  fontLineHeight: number
     *  horizontalSeparate: {
     *      pattern: string || cc.Color,
     *      size: cc.size(),
     *      align: string # 'left' | 'full' | 'right' | 'none' # default 'full'
     *  }
     *  // TODO 
     *  button & clickEvent handler when cell contains button. button with/without label
     * }
     * 
     * @param isNode {boolean} if this cell is instance of cc.Node, ignore `opts` param
     * @memberOf CellRub 
     */
    constructor(cell, opts = {}) {
        let defaultOptions = {
            bgColor: app.const.COLOR_VIOLET, // # violet
            width: 100,
            height: 50,
            fontColor: app.const.COLOR_YELLOW, // # yellow
            fontSize: 16,
            fontLineHeight: 20,
            horizontalSeparate: null
        };

        this.options = Object.assign({}, defaultOptions, opts);

        this.cell = cell;

        if (this.cell instanceof cc.Node) {
            this._addNodeToCell(this.cell);
        } else {
            if (this.cell instanceof Object) {
                let defaultCellObject = {
                    text: ''
                };
                this.cell = Object.assign({}, defaultCellObject, this.cell);
            }
            this._initCell();
        }
    }

    node() {
        return this.cellNode;
    }

    getHeight() {
        return this.cellNode.getContentSize().height;
    }

    resizeHeight(height) {
        if (this.cellNode) {
            let size = this.cellNode.getContentSize();
            size.height = height;
            // resize
            let cellSprite = this.cellNode.getComponent(cc.Sprite);
            RubUtils.loadSpriteFrame(cellSprite, this.options.spriteFrame || 'textures/50x50', size);
        }
    }

    // resettingHorizontalSeparate(width) {

    // }

    _addNodeToCell(node) {
        this.cellNode && this.cellNode.addChild(cc.instantiate(node));
    }

    _initCell() {
        this.cellNode = new cc.Node();
        this.cellNode.name = 'cell';
        let size = cc.size(this.options.width, this.options.height);
        this.cellNode.setContentSize(size);

        if (this.cell instanceof Object && this.cell.button)
            this._initButton(this.cellNode);
        else
            this._initLabel(this.cellNode); // init label

        let lblChildNode = this.cellNode.getChildByName('label');
        if (lblChildNode) {
            if (lblChildNode.getLineCount() > 1)
                this.cellNode.height *= lblChildNode.getLineCount() * 3 / 2;
        }

        size.height = this.cellNode.height;
        let cellSprite = this.cellNode.addComponent(cc.Sprite);
        RubUtils.loadSpriteFrame(cellSprite, this.options.spriteFrame || 'textures/50x50', size);

        if (!this.options.spriteFrame) {
            // fill color to sprite
            cellSprite.node.color = this.options.bgColor;
        }

        // if hasHorizontalSeparate
        if (this.options.horizontalSeparate && this.options.horizontalSeparate.align !== 'none') {
            this._initHorizontalSeparate(this.cellNode);
        }
    }

    _initHorizontalSeparate(parentNode) {
        this.horizontalSeparateNode = new cc.Node();
        this.horizontalSeparateNode.setPosition(cc.v2(0, 0));

        let nodeSize = this.options.horizontalSeparate.size || cc.size(parentNode.getContentSize().width, 2); // width: cellWidth, height: 2px
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

    _initButton(parentNode) {
        let btnNode = new cc.Node();
        btnNode.name = 'button';
        parentNode.addChild(btnNode);

        let size = null;
        if (this.cell.button.width && this.cell.button.height) {
            size = cc.size(this.cell.button.width, this.cell.button.height);
        } else {
            // = 1/2 cell's width, = 3/4 cell's height
            size = cc.size(parentNode.getContentSize().width / 2, 3 * parentNode.getContentSize().height / 4);
        }
        btnNode.setContentSize(size);

        let btnBtn = btnNode.addComponent(cc.Button);

        // btnBtn.interactable = true;
        // btnBtn.transition = cc.Button.Transition.SPRITE;

        // sprite
        let btnSprite = btnNode.addComponent(cc.Sprite);
        let defaultBtnSpriteFrameURL = 'game/images/ingame_green_btn';
        RubUtils.loadSpriteFrame(btnSprite, this.cell.button.spriteFrame || defaultBtnSpriteFrameURL, btnNode.getContentSize());

        // event
        if (this.cell.button.eventHandler) {
            let event = this.cell.button.eventHandler;
            if (event instanceof cc.Component.EventHandler) {
                btnBtn.clickEvents = [event];
            }
        }

        // button scaler
        btnNode.addComponent(ButtonScaler);

        // label
        if (this.cell.text) {
            this._initLabel(btnNode);
        }

    }

    _initLabel(parentNode) {
        let nodeOptions = {
            name: 'label',
            color: this.options.fontColor,
            size: parentNode.getContentSize(),
            richtext: {
                maxWidth: (parentNode.getContentSize().width - 10),
                fontSize: this.options.fontSize,
                lineHeight: this.options.fontLineHeight,
                horizontalAlign: cc.RichText.HorizontalAlign.CENTER,
                text: this.cell instanceof Object ? this.cell.text : this.cell,
                font: this.options.font,
                outline: {
                    color: app.const.COLOR_BLACK,
                    width: 1.5
                }
            }
        };

        let lblNode = NodeRub.createNodeByOptions(nodeOptions);

        parentNode.addChild(lblNode);
    }
}