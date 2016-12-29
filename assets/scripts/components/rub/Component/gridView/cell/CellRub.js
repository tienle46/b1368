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
     *  width: number
     *  height: number
     *  fontColor: new cc.Color
     *  font: cc.Font
     *  fontSize: number
     *  fontLineHeight: number
     *  // TODO 
     *  button & clickEvent handler when cell contains button. button with/without label
     * }
     * 
     * @param isNode {boolean} if this cell is instance of cc.Node, ignore `opts` param
     * @memberOf CellRub 
     */
    constructor(cell, opts = {}) {
        let defaultOptions = {
            width: 100,
            height: 60,
            fontColor: app.const.COLOR_YELLOW, // # yellow
            fontSize: 18,
            fontLineHeight: 60,
            font: 'fonts/newFonts/helveticaneue2'
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
            } else {
                this.cell && (this.cell = (typeof this.cell == 'string') ? this.cell : this.cell.toString());
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
            if (cellSprite) {
                RubUtils.loadSpriteFrame(cellSprite, this.options.spriteFrame, size);
            } else {
                this.cellNode.setContentSize(size);
            }
        }
    }

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
            if (lblChildNode.getLineCount() > 1) {
                this.cellNode.height *= lblChildNode.getLineCount() * 3 / 2;
            }
        }

        size.height = this.cellNode.height;
        if (this.options.spriteFrame) {
            let cellSprite = this.cellNode.addComponent(cc.Sprite);
            RubUtils.loadSpriteFrame(cellSprite, this.options.spriteFrame, size);
        }
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
            size = cc.size(this.cell.button.width || parentNode.getContentSize().width / 2, this.cell.button.height || 3 * parentNode.getContentSize().height / 4);
        }

        btnNode.setContentSize(size);

        let btnBtn = btnNode.addComponent(cc.Button);

        // btnBtn.interactable = true;
        // btnBtn.transition = cc.Button.Transition.SPRITE;

        // sprite
        let btnSprite = btnNode.addComponent(cc.Sprite);
        let defaultBtnSpriteFrameURL = 'blueTheme/general/buttons/ninePaths/btn-xanhla';
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
            this._initLabel(btnNode, true);
        }

    }

    _initLabel(parentNode, isInsideBtn = false) {
        let nodeOptions = {
            name: 'label',
            color: this.options.fontColor,
            size: parentNode.getContentSize(),
        };

        if (isInsideBtn) {
            nodeOptions.label = {
                fontSize: this.options.fontSize,
                lineHeight: this.options.fontLineHeight,
                horizontalAlign: cc.Label.HorizontalAlign.CENTER,
                verticalAlign: cc.Label.VerticalAlign.CENTER,
                overflow: cc.Label.Overflow.RESIZE_HEIGHT,
                text: this.cell instanceof Object ? this.cell.text : this.cell,
                font: 'fonts/newFonts/ICIELPANTON-BLACK',
                outline: {
                    color: app.const.COLOR_BLACK,
                    width: 1.5
                }
            };
        } else {
            nodeOptions.richtext = {
                maxWidth: (parentNode.getContentSize().width - 10),
                fontSize: this.options.fontSize,
                lineHeight: this.options.fontLineHeight,
                horizontalAlign: cc.RichText.HorizontalAlign.CENTER,
                text: this.cell instanceof Object ? this.cell.text : this.cell,
                font: this.options.font || 'fonts/newFonts/ICIELPANTON-BLACK',
                outline: {
                    color: app.const.COLOR_BLACK,
                    width: 1.5
                }
            }
        }

        let lblNode = NodeRub.createNodeByOptions(nodeOptions);

        parentNode.addChild(lblNode);
    }
}