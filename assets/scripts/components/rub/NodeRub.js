import ButtonScaler from 'ButtonScaler';
import RubUtils from 'RubUtils';
import { isFunction } from 'GeneralUtils';

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
        window.free(opts);
    },
    /**
     * @param {any} options:
     * {
     *  fontSize: number,
     *  lineHeight: number,
     *  font: cc.Font
     *  text: string,
     *  horizontalAlign: # default cc.Label.HorizontalAlign.CENTER,
     *  verticalAlign: # default cc.Label.VerticalAlign.CENTER
     *  overflow: # default.cc.Label.Overflow.CLAMP,
     *  enableWrapText : boolean
     *  outline: {
     *      color: new cc.Color
     *      width: number
     *  }
     *  (optional) fontColor:
     * }
     */
    addLabelComponentToNode: (node, options) => {
        let label = node.getComponent(cc.Label) || node.addComponent(cc.Label);
        label.string = options.text || '';
        options.font && RubUtils.loadFont(label, options.font);

        options.outline && (NodeRub.addOutlineComponentToNode(node, options.outline));

        delete options.outline;
        delete options.font;
        delete options.text;
        if (options.fontColor) {
            node.color = options.fontColor;
            delete options.fontColor;
        }
        for (let key in options) {
            label[key] = options[key];
        }
        node.getLineCount = () => label._lineCount;
        window.free(options);
    },
    /**
     * @param options
     * {
     * fontSize: number,
     * lineHeight: number,
     * font: cc.Font
     * text: string,
     * horizontalAlign: # default cc.Label.HorizontalAlign.CENTER,
     * maxWidth: number
     * overflow: # default.cc.Label.Overflow.CLAMP
     *  (optional) fontColor:
     * }
     */
    addRichTextComponentToNode: (node, options) => {
        let rich = node.getComponent(cc.RichText) || node.addComponent(cc.RichText);
        rich.string = options.text || '';
        options.font && RubUtils.loadFont(rich, options.font);

        delete options.text;
        delete options.font;
        if (options.fontColor) {
            node.color = options.fontColor;
            delete options.fontColor;
        }

        for (let key in options) {
            rich[key] = options[key];
        }

        node.getLineCount = () => rich._lineCount;
        window.free(options);
    },
    /**
     * @param options
     * color: new cc.color
     * width: number
     */
    addOutlineComponentToNode: (node, options) => {
        let outline = node.getComponent(cc.LabelOutline) || node.addComponent(cc.LabelOutline);
        outline.color = options.color;
        outline.width = options.width;
        window.free(options);
    },
    /**
     * @param options
     * {
     * type: cc.Layout.Type.VERTICAL,
     * resizeMode: cc.Layout.ResizeMode.NONE,
     * cellSize: cc.size(), // children resize mode
     * padding: 10,
     * spacingY: 20,
     * spacingX: 20,
     * startAxis: cc.Layout.AxisDirection.HORIZONTAL, (grid)
     * verticalDirection: cc.Layout.VerticalDirection.TOP_TO_BOTTOM
     * horizontalDirection: cc.Layout.HorizontalDirection.LEFT_TO_RIGHT
     * }
     */
    addLayoutComponentToNode: (node, options) => {
        let layout = node.getComponent(cc.Layout) || node.addComponent(cc.Layout);
        for (var key in options) {
            layout[key] = options[key];
        }
        window.free(options);
    },
    /**
     * @param options
     * {
     *  value: btn value
     *  event: cc.Event
    //  * spriteFrame: string
     *  label: {addLabel's options}    
     * }
     */
    addButtonComponentToNode: (node, options) => {
        let button = node.getComponent(cc.Button) || node.addComponent(cc.Button);
        if (options.event) {
            if (options.event instanceof cc.Component.EventHandler)
                button.clickEvents = [options.event];
            else if (isFunction(options.event)) {
                node.on(cc.Node.EventType.TOUCH_END, options.event);
            }
        }

        button.value && (button.value = options.value);

        node.addComponent(ButtonScaler);

        if (options.label) {
            let o = {
                name: 'btnLabel',
                label: options.label
            };

            let lblNode = NodeRub.createNodeByOptions(o);
            node.addChild(lblNode);
        }
        window.free(options);
    },
    /**
     * @param options
     * {
     *  spriteFrame: string || cc.SpriteFrame,
     *  cb: [function] rubutils' load cb
     *  isCORS: boolean
     *  type: cc.Sprite.Type.SLICE,
     *  sizeMode: cc.Sprite.SizeMode.CUSTOM,
     *  trim: boolean,
     * }
     */
    addSpriteComponentToNode: (node, options) => {
        let sprite = node.getComponent(cc.Sprite) || node.addComponent(cc.Sprite);
        let spriteFrame = options.spriteFrame;
        options = Object.assign({
            type: cc.Sprite.Type.SLICED,
            sizeMode: cc.Sprite.SizeMode.CUSTOM
        }, options);
        
        if (typeof spriteFrame === 'string') {
            delete options.spriteFrame;
            
            RubUtils.loadSpriteFrame(sprite, spriteFrame, node.getContentSize(), options.isCORS || false, options.cb, options);
        } else if (spriteFrame instanceof cc.SpriteFrame) {
            delete options.spriteFrame;
            sprite.spriteFrame = spriteFrame;
            
            for (let key in options) {
                sprite[key] = options[key];
            }
        }
        window.free(options);
    },
    /**
     * @param options
     * {
     * url: String
     * }
     */
    addWebViewComponentToNode: (node, options) => {
        let webView = node.getComponent(cc.WebView) || node.addComponent(cc.WebView);
        webView.url = options.url;
        window.free(options);
    },
    /**
     * 
     * @param {any} options
     * {
     *  toggleGroup: cc.Node || null,
     *  event : cc.Component.EventHandler
     *  sChecked: boolean
     * }
     * @returns
     */
    addToggleComponentToNode: (node, options) => {
        let toggle = node.addComponent(cc.Toggle);
        options.hasOwnProperty('toggleGroup') && (toggle.toggleGroup = options.toggleGroup);
        options.hasOwnProperty('event') && (toggle.checkEvents = [options.event]);
        options.hasOwnProperty('isChecked') && (toggle.isChecked = options.isChecked);
        window.free(options);
    },
    /**
     * @param options
     * {
     * string: '',
     * backgroundImage: '', # string dir resources || spriteFrame 
     * returnType: '', #cc.EditBox.KeyboardReturnType
     * inputFlag: '', #cc.EditBox.InputFlag
     * inputMode: '', #cc.EditBox.InputMode
     * fontSize: '',
     * lineHeight : '',
     * fontColor: '',
     * placeholder: '',
     * placeholderFontSize: '',
     * placeholderFontColor : '',
     * maxLength: '',
     * stayOnTop: '',
     * tabIndex : '',
     * editingDidBegin: cc.Component.EventHandler,
     * textChanged: cc.Component.EventHandler,
     * editingDidEnded : cc.Component.EventHandler,
     * editingReturn : cc.Component.EventHandler,
     * }
     */
    addEditBoxComponentToNode: (node, options) => {
        options = Object.assign({
            string: '',
            returnType: cc.EditBox.KeyboardReturnType.DEFAULT,
            inputFlag: cc.EditBox.InputFlag.SENSITIVE,
            inputMode: cc.EditBox.InputMode.SINGLE_LINE,
            stayOnTop: false
        }, options);

        let editbox = node.getComponent(cc.EditBox) || node.addComponent(cc.EditBox);

        let size = node.getContentSize();

        let handleOptions = (spriteFrame) => {
            spriteFrame && (options.backgroundImage = spriteFrame);

            for (let key in options) {
                editbox[key] = options[key];
                if (key === 'backgroundImage') {
                    editbox.node.setContentSize(size);
                }
            }
        };

        if (typeof options.backgroundImage === 'string') {
            RubUtils.loadRes(options.backgroundImage, cc.SpriteFrame).then(handleOptions);
        } else {
            handleOptions();
        }

        window.free(options);
    },
    /**
     * @param {any} options
     * {
     *      name: <string>,
     *      id: <int>,
     *      values: {}, <-- node's customization value
     *      position: <cc.v2>,
     *      size: <cc.size>,
     *      color: <new cc.Color>,
     *      anchor: <cc.v2>,
     *      scale: <cc.v2>,
     *      opacity: <number>,
     * }
     * @returns  cc.Node
     */
    createNodeByOptions(options) {
        let node = new cc.Node();
        options.name && (node.name = options.name);
        options.opacity && (node.opacity = options.opacity);

        options.size && node.setContentSize(options.size);
        options.color && (node.color = options.color);
        if (options.position) {
            options.position.x && node.setPositionX(options.position.x);
            options.position.y && node.setPositionY(options.position.y);
        }
        options.anchor && node.setAnchorPoint(options.anchor);
        options.scale && node.setScale(options.scale);

        NodeRub.addComponentsToNodeByOptions(node, options);

        // if (options.children && options.children.length > 0) {
        //     options.children.forEach((childOption) => {
        //         let n = NodeRub.createNodeByOptions(childOption);
        //         node.addChild(n);
        //     });
        // }
        return node;
    },
    /**
     *      widget: {
     *          isAlignOnce: boolean
     *          isAlignVerticalCenter, isAlignHorizontalCenter: boolean
     *          left, right, top, bottom: boolean
     *      }
     *      sprite: {
     *          spriteFrame: string || cc.SpriteFrame,
     *          cb: [function] rubutils' load cb
     *          isCORS: boolean
     *          type: cc.Sprite.Type.SLICE,
     *          sizeMode: cc.Sprite.SizeMode.CUSTOM,
     *          trim: boolean,
     *      }
     *      button: {
     *          event: cc.Event
     *          value: btn value
    //  *          spriteFrame: string
     *          label: {} // like below    
     *      },
     *      label: {
     *          fontSize: number,
     *          font: cc.Font
     *          lineHeight: number,
     *          text: string,
     *          horizontalAlign: # default cc.Label.HorizontalAlign.CENTER,
     *          verticalAlign: # default cc.Label.VerticalAlign.CENTER
     *          overflow: # default.cc.Label.Overflow.CLAMP,
     *          enableWrapText: boolean # default: true,
     *          outline: {color, width}
     *      },
     *      richtext: {
     *          fontSize: number,
     *          font: cc.Font
     *          lineHeight: number,
     *          text: string,
     *          horizontalAlign: # default cc.Label.HorizontalAlign.CENTER,
     *          maxWidth: number
     *          overFlow: # default.cc.Label.Overflow.CLAMP,
     *      },
     *      layout: {
     *          type: cc.Layout.Type.VERTICAL,
     *          resizeMode: cc.Layout.ResizeMode.NONE,
     *          padding: 10,
     *          spacingY: 20,
     *          startAxis: cc.Layout.AxisDirection.HORIZONTAL,
     *          verticalDirection: cc.Layout.VerticalDirection.TOP_TO_BOTTOM
     *      },
     *      toggle: {
     *          toggleGroup: cc.Node || null,
     *          event : cc.Component.EventHandler
     *          isChecked: boolean
     *      },
     *      editbox: {
     *          string: '',
     *          backgroundImage: '', # string dir resources || spriteFrame 
     *          returnType: '', # cc.EditBox.KeyboardReturnType
     *          inputFlag: '', # cc.EditBox.InputFlag
     *          inputMode: '', # cc.EditBox.InputMode
     *          fontSize: '',
     *          lineHeight : '',
     *          fontColor: '',
     *          placeholder: '',
     *          placeholderFontSize: '',
     *          placeholderFontColor : '',
     *          maxLength: '',
     *          stayOnTop: '',
     *          tabIndex : '',
     *          editingDidBegin: cc.Component.EventHandler,
     *          textChanged: cc.Component.EventHandler,
     *          editingDidEnded : cc.Component.EventHandler,
     *          editingReturn : cc.Component.EventHandler,
     *      },
     *      webview: {
     *          url : string
     *      }
     */
    addComponentsToNodeByOptions(node, options) {
        // sprite
        options.sprite && NodeRub.addSpriteComponentToNode(node, options.sprite);

        // toggle
        options.toggle && NodeRub.addToggleComponentToNode(node, options.toggle);

        // widget
        options.widget && NodeRub.addWidgetComponentToNode(node, options.widget);

        // layout
        options.layout && NodeRub.addLayoutComponentToNode(node, options.layout);

        // button
        options.button && NodeRub.addButtonComponentToNode(node, options.button);

        // label
        options.label && NodeRub.addLabelComponentToNode(node, options.label);

        // richtext
        options.richtext && NodeRub.addRichTextComponentToNode(node, options.richtext);

        // editbox
        options.editbox && NodeRub.addEditBoxComponentToNode(node, options.editbox);

        // webView
        options.webview && NodeRub.addWebViewComponentToNode(node, options.webview);

        window.free(options);
    }
};

export default NodeRub;