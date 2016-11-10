import RubUtils from 'RubUtils';
import app from 'app';
import ButtonScaler from 'ButtonScaler';

export default class ListItemBasicRub {
    /**
     * Creates an instance of ListItemBasicRub.
     * 
     * @param {string} content # a text attached to item
     * @param {any} [opts={}]
     * {
     *      # by default an item will be full filled by parent, therefore width always equals 100%
     *      contentWidth: number # width of text content. default: 520
            height: number # height of item, default 60,
            spriteFrame: string # default 'textures/50x50',
            color: new cc.Color # color of node default app.const.COLOR_VIOLET,
            fontSize: number, # default 16
            fontLineHeight: number, # default 20
            fontColor: new cc.Color # default COLOR_WHITE
            horizontalAlign:,
            padding: number # node's padding
            align: { # position of content inside node, default padding-left: 10 (left:0, right:0 => align center)
                left: 10, 
                right: number,
                bottom: number,
                top: number,
                isOnTop, isOnBottom: boolean # while there's one in these is true, element will be placed on Top/Bot of item and padding by top/bottom property
            },
            button: { item button, default placed at the end of item (padding 40)
                width: number,
                height: number,
                spriteFrame: string,
                event: new cc.Component.EventHandler,
                value: {any} # attached value into btn.
                label: { # label inside button above
                    text: string,
                    fontSize: number,
                    fontLineHeight: number,
                    fontColor: new cc.Color,
                    align: {top, lef, right, bottom}
                }
            }
     * }
     * @memberOf ListItemBasicRub
     */
    constructor(content = '', opts = {}) {
        let defaultOptions = {
            contentWidth: 520,
            height: 60,
            // spriteFrame: 'textures/50x50',
            spriteFrame: 'game/images/ingame_menu_item_bg',
            // color: app.const.COLOR_VIOLET,
            color: app.const.COLOR_WHITE,
            fontSize: 16,
            fontLineHeight: 20,
            fontColor: app.const.COLOR_WHITE,
            horizontalAlign: cc.Label.HorizontalAlign.LEFT,
            align: {
                left: 20
            }
            // button: {
            //     width: 114,
            //     height: 47,
            //     spriteFrame: 'textures/login_btn_bg',
            //     event: null,
            //     label: {
            //         text: 'Xác nhận',
            //         fontSize: 16,
            //         lineHeight: 20,
            //         fontColor: app.const.COLOR_WHITE
            //     }
            // }
        };
        this.options = Object.assign({}, defaultOptions, opts);
        this.content = content;
        this.initItem();
    }

    /**
     * 
     * 
     * @param {any} [el={} || cc.Node]
     * {
     *      @required type: string {image || label || button} # kind of UI will be pushed to recent item,
     *      @required size: {
     *          @required width: number
     *          height: number
     *      }
     *      position: {x, y}
     *      value: {any} # defined button value
     *      text: string # if element is kind of label
     *      fontSize,
     *      fontColor,
     *      fontLineHeight,
     *      spriteFrame: string (if element is kind of image or button, this property must be declared)
     *      horizontalAlign: text's horizontalAlign (isn't node)
     *      @required align: {
     *          left: number,
     *          right: number,
     *          verticalCenter: true,
     *          top: number, #default 10
     *          bottom: number #default 10
     *          isOnTop, isOnBottom: boolean # while there's one in these is true, element will be placed on Top/Bot of item and padding by top/bottom property
     *      }
     * }
     * @memberOf ListItemBasicRub
     * Eg:
     * 
     * let event = new cc.Component.EventHandler();
        event.target = this.node;
        event.component = 'TabTransferTransaction';
        event.handler = 'testEvent';
     * let button = {
            type: 'button',
            spriteFrame: 'dashboard/dialog/imgs/hopqua',
            size: {
                width: 118,
                height: 126
            }
            event: event,
            value: { a: 123 },
            
            align: {
                right: 20
            }
            position : {
                x, y: number
            }
        }; 

        @param {any} opts : configuration options of element
        {
            position: {
                x: number,
                y: number
            },
            *size: { # higher priority than el.width/ el.height
                *width: number,
                height: number 
            } 
        }
     */
    pushEl(el = {}, opts = {}) {
        let defaultOptions = {
            // position: {
            //     x: 0,
            //     y: 0
            // },
        };

        let options = Object.assign({}, defaultOptions, opts);
        if (this.itemNode) {
            let isNode = el instanceof cc.Node;
            let node;

            if (isNode) {
                node = el;
                options.position && node.setPosition(options.position);
                let nodeCurrentSize = node.getContentSize();
                options.size && node.setContentSize(options.size.width || nodeCurrentSize.width || 0, options.size.height || nodeCurrentSize.height || 0);

                !options.size && (options.size = node.getContentSize());

                // resize item
                if (options.size && options.size.height && options.size.height > this.itemNode.getContentSize().height) {
                    let newSize = cc.size(this.itemNode.getContentSize().width, options.size.height + ((options.align && (options.align.top || 10) + (options.align.bottom || 10)) || 20));
                    // resize parent height.
                    this._resizeHeight(this.itemNode.getComponent(cc.Sprite), newSize);
                }
            } else {
                let defaultElement = {
                    type: 'label', // image || label || button,
                    align: {
                        top: 10,
                        bottom: 10
                    }
                };

                let element = Object.assign({}, defaultElement, el, options);

                // resize item
                if (element.size && element.size.height && element.size.height > this.itemNode.getContentSize().height) {
                    let newSize = cc.size(this.itemNode.getContentSize().width, element.size.height + (element.align.top || 10) + (element.align.top || 10));
                    // resize parent height.
                    this._resizeHeight(this.itemNode.getComponent(cc.Sprite), newSize);
                }

                node = this._createElement(element);
            }

            this.itemNode.addChild(node);
        }
    }

    _createElement(options) {
        let node = new cc.Node();
        options.position && node.setPosition(options.position);
        if (options.size.width) {
            let nodeSize = cc.size(options.size.width, options.size.height || this.itemNode.getContentSize().height);
            node.setContentSize(nodeSize);
        } else {
            console.error('element object need a width property');
            return;
        }
        let createSprite = (node) => {
            let nodeSprite = node.addComponent(cc.Sprite);
            RubUtils.loadSpriteFrame(nodeSprite, options.spriteFrame || '', node.getContentSize());
        };

        let createLabel = (text, node) => {
            let lblOpts = {
                horizontalAlign: options.horizontalAlign || cc.Label.HorizontalAlign.CENTER,
                fontSize: options.fontSize || this.options.fontSize,
                fontColor: options.fontColor || null,
                fontLineHeight: options.fontLineHeight || this.options.fontLineHeight,
                align: options.align
            };

            options.hasOwnProperty('horizontalAlign') && options.horizontalAlign === 0 && (lblOpts.horizontalAlign = options.horizontalAlign);

            this._addChildLabelNode(text, node, lblOpts);
        };

        if (options.type === 'image') {
            createSprite(node);
        } else if (options.type === 'button') {
            createSprite(node);
            let nodeBtn = node.addComponent(cc.Button);

            options.value && (node.value = options.value);
            // add Event Handler
            options.event && (nodeBtn.clickEvents = [options.event]);

            node.addComponent(ButtonScaler);

            options.text && createLabel(options.text, nodeBtn);
        } else {
            options.text && createLabel(options.text, node);
        }

        // widget
        this._addWidgetComponentToNode(node, 10, options.align);

        return node;
    }

    node() {
        return this.itemNode;
    }

    initItem() {
        this.itemNode = new cc.Node();
        let itemNodeSize = cc.size(this.options.contentWidth, this.options.height);
        this.itemNode.setContentSize(itemNodeSize);

        let itemNodeSprite = this.itemNode.addComponent(cc.Sprite);
        RubUtils.loadSpriteFrame(itemNodeSprite, this.options.spriteFrame || 'textures/50x50', itemNodeSize, null, (sprite) => {
            if (this.options.color) sprite.node.color = this.options.color;
        });

        let itemNodeWidget = this.itemNode.addComponent(cc.Widget);
        itemNodeWidget.isAlignOnce = false;

        itemNodeWidget.isAlignLeft = true;
        itemNodeWidget.isAlignRight = true;

        itemNodeWidget.left = this.options.padding || 0;
        itemNodeWidget.right = this.options.padding || 0;
    }

    initChild() {
        if (this.itemNode) {
            let lblOpts = {
                horizontalAlign: this.options.horizontalAlign,
                fontSize: this.options.fontSize,
                fontColor: this.options.fontColor,
                fontLineHeight: this.options.fontLineHeight,
                align: this.options.align
            };
            // itemNode -> label
            this._addChildLabelNode(this.content, this.itemNode, lblOpts);

            this.options.button && this._initBtnGroup(this.itemNode);
        }
    }

    _initBtnGroup(parent) {
        let btnGroupNode = new cc.Node();
        let btnSize = cc.size(this.options.button.width, this.options.button.height);
        btnGroupNode.setContentSize(btnSize);
        parent.addChild(btnGroupNode);

        let btnGroupNodeSprite = btnGroupNode.addComponent(cc.Sprite);
        RubUtils.loadSpriteFrame(btnGroupNodeSprite, this.options.button.spriteFrame || 'textures/login_btn_bg', btnSize);

        let btnGroupNodeWidget = btnGroupNode.addComponent(cc.Widget);
        btnGroupNodeWidget.isAlignOnce = false;
        btnGroupNodeWidget.isAlignVerticalCenter = true;
        btnGroupNodeWidget.isAlignRight = true;
        btnGroupNodeWidget.right = 40;

        // btnGroupNode -> label
        if (this.options.button.label) {
            let lbl = this.options.button.label;
            if (!lbl.hasOwnProperty('align')) {
                lbl.align = {
                    left: 0,
                    right: 0
                };
            }
            let lblOpts = {
                horizontalAlign: cc.Label.HorizontalAlign.CENTER,
                fontSize: lbl.fontSize || this.options.fontSize,
                fontColor: lbl.fontColor || null,
                fontLineHeight: lbl.fontLineHeight || this.options.fontLineHeight,
                align: lbl.align
            };
            this._addChildLabelNode(lbl.text, btnGroupNode, lblOpts);
        }

        btnGroupNode.addComponent(ButtonScaler);

        let btnGroupBtn = btnGroupNode.addComponent(cc.Button);
        // add event
        this.options.button.event && (btnGroupBtn.clickEvents = [this.options.button.event]);
    }

    /**
     * 
     * 
     * @param {any} text
     * @param {any} parent
     * @param {any} [opts={}]
     * {
     *  (height: 100%)
     *  width: number
     *  name: string, # node name
     *  fontSize: number,
     *  fontColor: new cc.Color
     *  fontLineHeight: number,
     *  verticalAlign: ,
     *  horizontalAlign :,
     *  align: {
     *      top, left,: number
     *      right, bottom: number, #default 15
     *      isOnTop, isOnBottom: boolean # while there's one in these is true, element will be placed on Top/Bot of item and padding by top/bottom property
     *  }
     * }
     * @param memberOf ListItemBasicRub
     */
    _addChildLabelNode(text, parent, opts = {}) {
        let labelNode = new cc.Node();
        let parentSize = parent.getContentSize();
        labelNode.setContentSize(cc.size(opts.width || parentSize.width, parentSize.height));
        labelNode.name = opts.name || 'label';
        opts.fontColor && (labelNode.color = opts.fontColor);

        parent.addChild(labelNode);

        // let labelNodeLbl = labelNode.addComponent(cc.Label);
        // labelNodeLbl.string = text;
        // labelNodeLbl.horizontalAlign = opts.horizontalAlign || cc.Label.HorizontalAlign.LEFT;
        // labelNodeLbl.verticalAlign = opts.verticalAlign || cc.Label.VerticalAlign.CENTER;
        // labelNodeLbl.fontSize = opts.fontSize;
        // labelNodeLbl.lineHeight = opts.fontLineHeight;
        // labelNodeLbl.overflow = cc.Label.Overflow.RESIZE_HEIGHT;

        let rich = labelNode.addComponent(cc.RichText);
        rich.maxWidth = (parentSize.width - 10);
        rich.fontSize = opts.fontSize;
        rich.lineHeight = opts.fontLineHeight;
        rich.horizontalAlign = opts.horizontalAlign;
        rich.string = text;

        labelNode.getLineCount = () => rich._lineCount;

        let lineCount = labelNode.getLineCount();
        if (lineCount > 1) {
            if (!parent.getComponent(cc.Button)) {
                //resize parent's height
                // parentSize.height *= (lineCount * 2 / 3);
                let sprite = parent.getComponent(cc.Sprite);
                if (sprite) {
                    parentSize.height += lineCount * opts.fontLineHeight - (opts.align.top || 15) - (opts.align.bottom || 15);
                    this._resizeHeight(sprite, parentSize);
                }
            }
        }

        //widget
        this._addWidgetComponentToNode(labelNode, 15, opts.align);
    }

    // resize height when exist a child height higher than parent 
    /**
     * 
     * 
     * @param {any} spriteComponent
     * @param {any} size
     * @param {boolean} isToggle # if list is kind of toggleable, it needs to change own height in toggleable way
     * 
     * @memberOf ListItemBasicRub
     */
    _resizeHeight(spriteComponent, size, isToggle = false) {
        // need to reload spriteFrame to display correctly.
        RubUtils.loadSpriteFrame(spriteComponent, this.options.spriteFrame || 'textures/50x50', null, false, (s) => {
            if (s.node.getContentSize().height < size.height || isToggle) {
                s.node.setContentSize(size);
            }
        });
    }

    _addWidgetComponentToNode(node, defaultValue, opts, isAlignOnce) {
        let widget = node.getComponent(cc.Widget) || node.addComponent(cc.Widget);
        widget.isAlignOnce = isAlignOnce || false;

        widget.isAlignVerticalCenter = opts.verticalCenter || false;

        if (!opts.verticalCenter) {
            if (opts.hasOwnProperty('isOnBottom') || opts.hasOwnProperty('isOnTop')) {
                opts.isOnTop && (widget.isAlignTop = true) && (widget.top = opts.top || defaultValue);
                opts.isOnBottom && (widget.isAlignBottom = true) && (widget.bottom = opts.bottom || defaultValue);
            } else {
                widget.isAlignTop = true;
                widget.isAlignBottom = true;
                widget.top = opts.top || defaultValue;
                widget.bottom = opts.bottom || defaultValue;
            }
        } else {
            widget.verticalCenter = 0;
        }

        if (opts.hasOwnProperty('right')) {
            widget.isAlignRight = true;
            widget.right = opts.right;
        }

        if (opts.hasOwnProperty('left')) {
            widget.isAlignLeft = true;
            widget.left = opts.left;
        }
    }
}