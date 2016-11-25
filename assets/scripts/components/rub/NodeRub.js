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
     *  overflow: # default.cc.Label.Overflow.CLAMP,
     *  enableWrapText : boolean
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
     * @param options
     * {
     * fontSize: number,
     * lineHeight: number,
     * text: string,
     * horizontalAlign: # default cc.Label.HorizontalAlign.CENTER,
     * maxWidth: number
     * overflow: # default.cc.Label.Overflow.CLAMP
     * }
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
     * @param options
     * {
     * type: cc.Layout.Type.VERTICAL,
     * resizeMode: cc.Layout.ResizeMode.NONE,
     * padding: 10,
     * spacingY: 20,
     * spacingX: 20,
     * startAxis: cc.Layout.AxisDirection.HORIZONTAL, (grid)
     * verticalDirection: cc.Layout.VerticalDirection.TOP_TO_BOTTOM
     * horizontalDirection: cc.Layout.HorizontalDirection.LEFT_TO_RIGHT
     * }
     */
    addLayoutComponentToNode: (node, options = {}) => {
        let layout = node.getComponent(cc.Layout) || node.addComponent(cc.Layout);
        for (var key in options) {
            layout[key] = options[key];
        }
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
    addButtonComponentToNode: (node, options = {}) => {
        let button = node.getComponent(cc.Button) || node.addComponent(cc.Button);
        if (options.event) {
            if (options.event instanceof cc.Component.EventHandler)
                button.clickEvents = [options.event];
            else if (options.event instanceof Function) {
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
    addSpriteComponentToNode: (node, options = {}) => {
        let sprite = node.addComponent(cc.Sprite);
        let spriteFrame = options.spriteFrame;
        let o = {
            type: cc.Sprite.Type.SLICED,
            sizeMode: cc.Sprite.SizeMode.CUSTOM
        };

        options.hasOwnProperty('type') && (o.type = options.type);
        options.hasOwnProperty('sizeMode') && (o.sizeMode = options.sizeMode);
        options.hasOwnProperty('trim') && (o.trim = options.trim);

        if (typeof spriteFrame === 'string')
            RubUtils.loadSpriteFrame(sprite, spriteFrame, node.getContentSize(), options.isCORS || false, options.cb, o);
        else if (spriteFrame instanceof cc.SpriteFrame) {
            sprite.spriteFrame = spriteFrame;
            for (let key in o) {
                sprite[key] = o[key];
            }
            node.setContentSize(node.getContentSize());
        }
    },
    /**
     * @param options
     * {
     * url: String
     * }
     */
    addWebViewComponentToNode: (node, options = {}) => {
        let webView = node.getComponent(cc.WebView) || node.addComponent(cc.WebView);
        webView.url = options.url;
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
    addToggleComponentToNode: (node, options = {}) => {
        let toggle = node.addComponent(cc.Toggle);
        options.hasOwnProperty('toggleGroup') && (toggle.toggleGroup = options.toggleGroup);
        options.hasOwnProperty('event') && (toggle.checkEvents = [options.event]);
        options.hasOwnProperty('isChecked') && (toggle.isChecked = options.isChecked);
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
    addEditBoxComponentToNode: (node, options = {}) => {
        let o = {
            string: '',
            returnType: cc.EditBox.KeyboardReturnType.DEFAULT,
            inputFlag: cc.EditBox.InputFlag.SENSITIVE,
            inputMode: cc.EditBox.InputMode.SINGLE_LINE,
            stayOnTop: false,
            maxLength: 1000,
            backgroundImage: 'textures/50x50'
        };
        options = Object.assign({}, o, options);

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
            RubUtils.loadRes(options.backgroundImage, true).then(handleOptions);
        } else {
            handleOptions();
        }

    },
    /**
     * @param {any} options
     * {
     *      name: <string>,
     *      position: <cc.v2>,
     *      size: <cc.size>,
     *      color: <new cc.Color>,
     *      anchor: <cc.v2>,
     *      scale: <cc.v2>,
     *      opacity: <number>,
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
     *          lineHeight: number,
     *          text: string,
     *          horizontalAlign: # default cc.Label.HorizontalAlign.CENTER,
     *          verticalAlign: # default cc.Label.VerticalAlign.CENTER
     *          overflow: # default.cc.Label.Overflow.CLAMP,
     *          enableWrapText: boolean # default: true
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
     * 
     *      @optional children: [{options}, {options}]
     * }
     * @returns  cc.Node
     */
    createNodeByOptions(options) {
        let node = new cc.Node();
        options.name && (node.name = options.name);
        options.opacity && (node.opacity = options.opacity);

        options.size && node.setContentSize(options.size);
        options.color && (node.color = options.color);
        options.position && node.setPosition(options.position);
        options.anchor && node.setAnchorPoint(options.anchor);
        options.scale && node.setScale(options.scale);

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

        if (options.children && options.children.length > 0) {
            options.children.forEach((childOption) => {
                let n = NodeRub.createNodeByOptions(childOption);
                node.addChild(n);
            });
        }

        return node;
    }
};

export default NodeRub;