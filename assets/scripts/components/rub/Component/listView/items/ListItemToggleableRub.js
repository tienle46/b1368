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
        this.initItem();
    }

    initItem() {
        super.initItem();
        if (this.itemNode) {
            let layout = this.itemNode.getComponent(cc.Layout);
            if (!layout)
                layout = this.itemNode.addComponent(cc.Layout);
            layout.type = cc.Layout.Type.HORIZONTAL;
            layout.resizeMode = cc.Layout.ResizeMode.NONE;
            layout.padding = this.options.padding;
            layout.spacingX = this.options.spacingX;
        }
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
    _initItem(image, body, button, opts = {}) {
        let defaultOptions = {
            size: {
                width: 860,
                height: 80
            },
            group: {
                widths: [60, 360, 54]
            },
            padding: 10,
            spacingX: 10
        };

        let options = Object.assign({}, defaultOptions, opts);

        let widths = this._resetSizeByOptions(options);

        image && this._initImage(image, widths[0]);
        body && this._initBody(body, widths[1]);
        button && this._toggleButton(button, widths[2]);
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
     *      *spriteFrame,
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
     *          }
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

        let options = {};
        options.size = size;

        let node = new cc.Node();
        node.name = 'body';

        options.size && node.setContentSize(options.size);

        let layout = node.addComponent(cc.Layout);
        layout.type = cc.Layout.Type.VERTICAL;
        layout.resizeMode = cc.Layout.ResizeMode.CONTAINER;

        this._addWidgetComponentToNode(node, 10, body.options.align);

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
        titleOptions.fontColor = app.const.COLOR_YELLOW;
        titleOptions.name = 'titleLabel';
        this._addChildLabelNode(body.title.content || '', node, titleOptions);

        // subTitle
        let subTitleOptions = Object.assign({}, defaultOptions, body.subTitle.options || {});
        subTitleOptions.fontSize = 16;
        subTitleOptions.name = 'subTitleLabel';
        this._addChildLabelNode(body.subTitle.content || '', node, subTitleOptions);

        // detail
        // let detailOptions = Object.assign({}, defaultOptions, body.detail.options || {});
        // detailOptions.fontSize = 16;
        // detailOptions.name = 'detailLabel';
        // this._addChildLabelNode(body.detail.content || '', node, detailOptions);
        this._resizeHeight(this.itemNode.getComponent(cc.Sprite), node.getContentSize());
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
    _addChildLabelNode(text, parent, opts = {}) {
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
        if (lineCount > 1) {
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
     *      *spriteFrame,
     *      position: {x, y},
     *      event: cc.Component.EventHandler
     *      align: {top,left,right,bottom}
     * }
     * @memberOf ListItemToggleableRub
     */
    _toggleButton(button, size) {
        let node = new cc.Node();
        let options = {
            spriteFrame: 'dashboard/dialog/imgs/xuong',
            align: {
                right: 10,
                isOnBottom: true
            },
            height: 45
        };
        options = Object.assign({}, options, button);
        options.size = size;
        options.size.height = options.height;

        options.size && node.setContentSize(options.size);
        node.name = 'toggleButton';

        // btn
        let btn = node.addComponent(cc.Button);
        options.event && (btn.clickEvents = [options.event]);

        // btn scaler
        node.addComponent(ButtonScaler);

        let sprite = node.addComponent(cc.Sprite);
        options.spriteFrame && RubUtils.loadSpriteFrame(sprite, options.spriteFrame, options.size, false, (s) => {
            btn.normalSprite = s.spriteFrame;
        });

        this._addWidgetComponentToNode(node, 20, options.align);

        this._addToggleableClick(btn);
        this.pushEl(node);
    }

    _addToggleableClick(btn) {
        btn.node.on(cc.Node.EventType.TOUCH_END, ((e) => {
            console.debug(e, 'TOOOOGGGGLLLLLEEEEE');
        }).bind(this));
    }
}