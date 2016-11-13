import app from 'app';
import ListItemBasicRub from 'ListItemBasicRub';
import RubUtils from 'RubUtils';
import ButtonScaler from 'ButtonScaler';
// import ListItem from 'ListItem';

export default class ListItemToggleableRub extends ListItemBasicRub {
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
    constructor(opts = {}) {
        super('', opts);
        let defaultOptions = {
            spacingX: 10,
            padding: 10
        };
        this.options = Object.assign({}, this.options || {}, defaultOptions, opts);
        [this.upSprite, this.downSprite] = [null, null];
        this.initItem();
    }


    /**
     * 
     * @param {any || cc.Node} image
     * @param {[any] || [cc.Node]} body [title, subTitle, content]
     * @param {any || cc.Node} button
     * @param {any} opts
     * {
     *      size: { width, height } # size of item
     *      group: {
     *          widths: [string || Number] # ['10%', '30%', ''] || [10, 30, ''], default: ['10%', '80%', '10%'] width of elements inside
     *      }
     *      padding: 10,
            spaceX: 10
     * }
     * 
     * @memberOf ListItemToggleableRub
     */
    initElement(body, image, button, opts = {}) {
        let defaultOptions = {
            size: {
                width: 860,
                height: 80
            },
            group: {
                widths: []
            },
            padding: 10,
            spacingX: 10
        };

        let options = Object.assign({}, defaultOptions, opts);

        let sizes = this._resetSizeByOptions(options);

        let s = this._setupComponentBySizes(sizes, image, body, button);

        image && s.imageSize && this._initImage(image, s.imageSize);
        body && s.bodySize && this._initBody(body, s.bodySize);
        button && s.buttonSize && this._toggleButton(button, s.buttonSize);
    }


    /**
     * Setup component's size by array size
     * 
     * widths = ['x'] => body-x [0]
     * widths = ['x', 'y'] => image-x [0], body-y [1]
     * widths = ['x', 'y', 'z'] => image-x[0], body-y[1], button-z [2]
     * 
     * @param {any} sizes
     * @returns
     * 
     * @memberOf ListItemToggleableRub
     */
    _setupComponentBySizes(sizes, image, body, button) {
        let lenSize = sizes.length;

        let [imageSize, bodySize, buttonSize] = [null, null, null];

        if (lenSize >= 3) {
            imageSize = sizes[0];
            bodySize = sizes[1];
            buttonSize = sizes[2];
        } else if (lenSize >= 2) {
            if (image) {
                imageSize = sizes[0];
                bodySize = sizes[1];
            } else if (button) {
                bodySize = sizes[0];
                buttonSize = sizes[1];
            }
        } else if (lenSize >= 1) {
            if (image) {
                imageSize = sizes[0];
            } else if (body) {
                bodySize = sizes[0];
            } else if (button) {
                buttonSize = sizes[0];
            }
        }

        return { imageSize, bodySize, buttonSize };
    }

    _resetSizeByOptions(options) {
        let o = Object.assign({}, options);
        let { width, height } = o.size;
        let widths = o.group.widths;
        let spacingX = o.spacingX;
        let padding = o.padding;

        return RubUtils.calcWidthByGroup(width, widths, spacingX, padding).map((width) => ({ width, height }));
    }

    /**
     * 
     * @param {any || cc.Node} image
     * {
     *      @required spriteFrame,
     *      position: {x, y},
     *      align: {top,left,right,bottom}
     * }
     * @memberOf ListItemToggleableRub
     */
    _initImage(image, size) {
        let isNode = image instanceof cc.Node;
        let [node, options] = [null, {}];

        options.size = size;
        if (isNode) {
            node = image;
        } else {
            let defaultOptions = {
                spriteFrame: 'dashboard/dialog/imgs/hopqua',
                align: {
                    left: 10,
                    top: 10,
                    isOnTop: true
                }
            };
            options = Object.assign({}, defaultOptions, image, options);

            node = new cc.Node();
            node.name = 'imageView';
        }

        options.size && node.setContentSize(options.size);
        options.position && node.setPosisiton(options.position);

        if (options.spriteFrame) {
            let nodeSprite = node.getComponent(cc.Sprite) || node.addComponent(cc.Sprite);
            RubUtils.loadSpriteFrame(nodeSprite, options.spriteFrame, options.size);

        } else {
            cc.error('image need spriteFrame');
        }

        if (options.align) {
            this._addWidgetComponentToNode(node, 10, options.align);
        }

        this.pushEl(node);
    }

    /**
     * 
     * @param {any} body
     * {
     *      {
     *          title: {
     *              content: string,
     *              options: {} // _addChildLabelNode's options
     *          },
     *          subTitle: {
     *              content: string,
     *              options: {} // _addChildLabelNode's options
     *          },
     *          detail: {
     *              content: string,
     *              options: {} // _addChildLabelNode's options
     *          },
     *      }
     *
     * }
     * 
     * @memberOf ListItemToggleableRub
     */
    _initBody(body, size) {
        let defaultBody = {
            title: {},
            subTitle: {},
            detail: {},
            options: {
                align: {
                    left: 80
                }
            }
        };

        body = Object.assign({}, defaultBody, body);

        let options = Object.assign({}, body.options);
        options.size = size;

        let node = new cc.Node();
        node.name = 'body';

        options.size && node.setContentSize(options.size);
        let layout = node.addComponent(cc.Layout);
        layout.type = cc.Layout.Type.VERTICAL;
        layout.resizeMode = cc.Layout.ResizeMode.CONTAINER;
        layout.padding = 10;
        layout.spacingY = 10;

        this._addWidgetComponentToNode(node, 10, options.align);

        // init children
        let defaultOptions = {
            align: {
                left: 0,
                right: 0,
                top: 10,
                bottom: 10
            },
            height: 40,
            fontSize: 18,
            horizontalAlign: cc.Label.HorizontalAlign.LEFT,
            fontLineHeight: 20
        };

        // title
        let titleOptions = Object.assign({}, defaultOptions, body.title.options || {});
        titleOptions.fontColor = titleOptions.fontColor || app.const.COLOR_YELLOW;
        titleOptions.name = 'titleLabel';
        this._addChildLabelNode(`<b>${body.title.content || ''}</b>`, node, titleOptions);

        // subTitle
        let subTitleOptions = Object.assign({}, defaultOptions, body.subTitle.options || {});
        subTitleOptions.fontSize = subTitleOptions.fontSize || 16;
        subTitleOptions.name = 'subTitleLabel';
        this._addChildLabelNode(`<i>${body.subTitle.content || ''}</i>`, node, subTitleOptions);

        // this._resizeHeight(this.itemNode.getComponent(cc.Sprite), node.getContentSize());

        // detail
        let detailOptions = Object.assign({}, defaultOptions, body.detail.options || {});
        detailOptions.fontSize = detailOptions.fontSize || 16;
        detailOptions.name = 'detailLabel';
        this._addChildLabelNode(body.detail.content || '', node, detailOptions, false);

        this.detailLabelNode = node.getChildByName('detailLabel');
        this.detailLabelNode.active = false;
        this.pushEl(node);
    }

    /**
     * 
     * 
     * @param {any} text
     * @param {any} parent
     * @param {any} [opts={}]
     * {
     *  (width: 100%)
     *  height: number
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
     * @memberOf ListItemBasicRub
     */
    _addChildLabelNode(text, parent, opts = {}, immediateResize = true) {
        let labelNode = new cc.Node();

        let parentSize = parent.getContentSize();
        labelNode.setContentSize(cc.size(parentSize.width, opts.height));
        labelNode.name = opts.name || 'label';
        labelNode.color = opts.fontColor || app.const.COLOR_WHITE;

        parent.addChild(labelNode);

        let rich = labelNode.addComponent(cc.RichText);
        rich.maxWidth = (parentSize.width - 10);
        rich.fontSize = opts.fontSize;
        rich.lineHeight = opts.fontLineHeight;
        rich.horizontalAlign = opts.horizontalAlign;
        rich.string = text;

        labelNode.getLineCount = () => rich._lineCount;

        let lineCount = labelNode.getLineCount();

        if (immediateResize && lineCount > 1) {
            if (!parent.getComponent(cc.Button)) {
                //resize parent's height
                // parentSize.height *= (lineCount * 2 / 3);
                parentSize.height += lineCount * opts.fontLineHeight - (opts.align.top || opts.defaultValue) - (opts.align.bottom || opts.defaultValue);
                parent.setContentSize(parentSize);
                // let sprite = parent.getComponent(cc.Sprite);
                // if (sprite) {
                //      parentSize.height += lineCount * opts.fontLineHeight - (opts.align.top || opts.defaultValue) - (opts.align.bottom || opts.defaultValue);
                //      this._resizeHeight(sprite, parentSize);
                // }
            }
        }

        //widget
        this._addWidgetComponentToNode(labelNode, opts.defaultValue, opts.align);
    }

    /**
     * 
     * @param {any || cc.Node} image
     * {
     *      *downSpriteFrame,
     *      position: {x, y},
     *      //event: cc.Component.EventHandler
     *      align: {top,left,right,bottom}
     * }
     * @memberOf ListItemToggleableRub
     */
    _toggleButton(button, size) {
        this.toggletBtnNode = new cc.Node();
        this.toggletBtnNode.name = 'toggleButton';


        let options = {
            downSpriteFrame: 'dashboard/dialog/imgs/xuong',
            upSpriteFrame: 'dashboard/dialog/imgs/len',
            align: {
                right: 20,
                bottom: 20,
                isAlignBottom: true,
                verticalCenter: true
            },
            height: 45
        };

        options = Object.assign({}, options, button);
        options.size = size;
        options.size.height = options.height;

        options.size && this.toggletBtnNode.setContentSize(options.size);

        // btn
        let btn = this.toggletBtnNode.addComponent(cc.Button);
        // options.event && (btn.clickEvents = [options.event]);

        // btn scaler
        this.toggletBtnNode.addComponent(ButtonScaler);

        let sprite = this.toggletBtnNode.addComponent(cc.Sprite);

        (!this.upSprite) && options.upSpriteFrame && RubUtils.loadSpriteFrame(sprite, options.upSpriteFrame, options.size, false, (s) => {
            btn.normalSprite = s.spriteFrame;
            this.upSprite = s.spriteFrame;
        });

        (!this.downSprite) && options.downSpriteFrame && RubUtils.loadSpriteFrame(sprite, options.downSpriteFrame, options.size, false, (s) => {
            btn.normalSprite = s.spriteFrame;
            this.downSprite = s.spriteFrame;
        });

        // widget
        this._addWidgetComponentToNode(this.toggletBtnNode, 20, options.align);
        options.align.bottom && (this.toggletBtnNode.getComponent(cc.Widget).bottom = options.align.bottom);
        options.align.top && (this.toggletBtnNode.getComponent(cc.Widget).top = options.align.top);

        this._addToggleableClick(btn);

        this.pushEl(this.toggletBtnNode);
    }

    _addToggleableClick(btn) {
        btn.node.on(cc.Node.EventType.TOUCH_END, this._onToggleableBtnClick.bind(this));
    }

    _onToggleableBtnClick(e) {
        e.stopPropagation();
        let widget = e.currentTarget.getComponent(cc.Widget);
        widget.isAlignBottom = !widget.isAlignBottom;

        if (this.detailLabelNode) {
            this.detailLabelNode.active = !this.detailLabelNode.active;
            let sprite = this.toggletBtnNode.getComponent(cc.Sprite);
            let btn = this.toggletBtnNode.getComponent(cc.Button);
            if (this.detailLabelNode.active) {
                sprite.spriteFrame = this.upSprite;
                btn.normalSprite = this.upSprite;
            } else {
                sprite.spriteFrame = this.downSprite;
                btn.normalSprite = this.downSprite;
            }

            let size = this.itemNode.getContentSize();
            size.height += (this.detailLabelNode.active ? 1 : -1) * this.detailLabelNode.getContentSize().height;

            this._resizeHeight(this.itemNode.getComponent(cc.Sprite), size, true);
            if (!widget.isAlignBottom) {
                widget.isAlignVerticalCenter = true;
            }
        }
    }

    /**
     * 
     * 
     * @static
     * @param {any} [body={}] initElement's body object
     * @param {any} [options={} || image] initElement's options
     * params [body, image, button, options]
     * if params 
     *  +> = [body, p1, p2] => p1 = image, p2 = options
     *  +> = [body, p1, p2, p3] => p1 = image, p2 = button, p3 = options 
     * @memberOf ListItemToggleableRub
     */
    static create(body, options, ...args) {
        let item = new ListItemToggleableRub();
        let [image, button] = [{}, {}];
        let length = args.length;
        if (length >= 1) {
            image = options;
            options = args[length - 1];
        }

        length >= 2 && (button = args[1]);
        item.initElement(body, image, button, options);

        return item;
    }
}