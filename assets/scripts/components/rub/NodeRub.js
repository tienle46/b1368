import ButtonScaler from 'ButtonScaler';
import RubUtils from 'RubUtils';

let NodeRub = {
    /**
     * @param node {cc.Node} node where widget to be added
     * @param defaultValue: defaultValue of top and bottom align
     * @param opts {any}
     *  {
     *      top, left, bottom, right : number
     *      isOnBottom, isOnTop: boolean # node will not be resized when parent/its height's changed
     *      verticalCenter, hortizontalCenter: boolean # when this property equals true, node will be align by verticalCenter/horizontalCenter from parent's height without using top and bottom
     *  }
     * @param isAlignOnce : boolean # default = false
     */
    addWidgetComponentToNode: (node, opts = {}, defaultValue = 10, isAlignOnce = false) => {
        let widget = node.getComponent(cc.Widget) || node.addComponent(cc.Widget);
        widget.isAlignOnce = isAlignOnce;

        widget.isAlignVerticalCenter = opts.verticalCenter || false;
        widget.isAlignHorizontalCenter = opts.hortizontalCenter || false;

        if (!opts.verticalCenter) {
            if (opts.hasOwnProperty('isOnBottom') || opts.hasOwnProperty('isOnTop')) {
                opts.isOnTop && (widget.isAlignTop = true) && (widget.top = opts.top || defaultValue);
                opts.isOnBottom && (widget.isAlignBottom = true) && (widget.bottom = opts.bottom || defaultValue);
            } else {
                if (opts.hasOwnProperty('top')) {
                    widget.isAlignTop = true;
                    widget.top = opts.top;
                }
                if (opts.hasOwnProperty('bottom')) {
                    widget.isAlignBottom = true;
                    widget.bottom = opts.bottom;
                }
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
    },
    /**
     * @param {any} options:
     * {
     *  fontSize: number,
     *  lineHeight: number,
     *  text: string,
     *  horizontalAlign: # default cc.Label.HorizontalAlign.CENTER,
     *  verticalAlign: # default cc.Label.VerticalAlign.CENTER
     *  overFlow: # default.cc.Label.Overflow.CLAMP
     * }
     */
    addLabelComponentToNode: (node, options = {}) => {
        let label = node.getComponent(cc.Label) || node.addComponent(cc.Label);
        label.string = options.text || '';
        delete options.text;
        for (var key in options) {
            label[key] = options[key];
        }
    },
    /**
     * fontSize: number,
     * lineHeight: number,
     * text: string,
     * horizontalAlign: # default cc.Label.HorizontalAlign.CENTER,
     * maxWidth: number
     * overFlow: # default.cc.Label.Overflow.CLAMP
     */
    addRichTextComponentToNode: (node, options = {}) => {
        let rich = node.getComponent(cc.RichText) || node.addComponent(cc.RichText);
        rich.string = options.text || '';
        delete options.text;
        for (var key in options) {
            rich[key] = options[key];
        }
        node.getLineCount = () => rich._lineCount;
    },
    /**
     * @param {any} options
     * {
     *      name: string,
     *      position: cc.v2
     *      size: cc.size
     *      color: new cc.Color
     *      widget: {
     *          isAlignOnce: boolean
     *          isAlignVerticalCenter, isAlignHorizontalCenter: boolean
     *          left, right, top, bottom: boolean
     *      }
     *      sprite: {
     *          spriteFrame: string,
     *          cb: [function] rubutils' load cb
     *      }
     *      button: {
     *          event: cc.Event
     *          spriteFrame: string
     *      },
     *      label: {
     *          fontSize: number,
     *          lineHeight: number,
     *          text: string,
     *          horizontalAlign: # default cc.Label.HorizontalAlign.CENTER,
     *          verticalAlign: # default cc.Label.VerticalAlign.CENTER
     *          overFlow: # default.cc.Label.Overflow.CLAMP
     *      },
     *      richtext: {
     *          fontSize: number,
     *          lineHeight: number,
     *          text: string,
     *          horizontalAlign: # default cc.Label.HorizontalAlign.CENTER,
     *          maxWidth: number
     *          overFlow: # default.cc.Label.Overflow.CLAMP
     *      },
     *      layout: {
     *          type: cc.Layout.Type.VERTICAL,
     *          resizeMode: cc.Layout.ResizeMode.NONE,
     *          padding: 10,
     *          spacingY: 20,
     *          verticalDirection: cc.Layout.VerticalDirection.TOP_TO_BOTTOM
     *      }
     * }
     * @returns  cc.Node
     */
    createNodeByOptions(options) {
        let node = new cc.Node();
        options.name && (node.name = options.name);

        options.size && node.setContentSize(options.size);
        options.color && (node.color = options.color);
        options.position && node.setPosition(options.position);

        // sprite
        if (options.sprite) {
            let bodySprite = node.addComponent(cc.Sprite);
            RubUtils.loadSpriteFrame(bodySprite, options.sprite.spriteFrame, options.size);
        }

        // widget
        options.widget && NodeRub.addWidgetComponentToNode(node, options.widget);

        if (options.layout) {
            let layout = node.addComponent(cc.Layout);
            layout.type = options.layout.type;
            layout.resizeMode = options.layout.resizeMode;
            layout.padding = options.layout.padding;
            options.layout.spacingY && (layout.spacingY = options.layout.spacingY);
            options.layout.spacingX && (layout.spacingX = options.layout.spacingX);
            options.layout.verticalDirection && (layout.verticalDirection = options.layout.verticalDirection);
            options.layout.horizontalDirection && (layout.horizontalDirection = options.layout.horizontalDirection);
        }

        if (options.button) {
            let button = node.addComponent(cc.Button);
            options.button.events && (button.clickEvents = [options.button.events]);

            node.addComponent(ButtonScaler);
        }

        options.label && NodeRub.addLabelComponentToNode(node, options.label);

        return node;
    }
};

export default NodeRub;