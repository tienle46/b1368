import ConfirmPopupRub from 'ConfirmPopupRub';
import NodeRub from 'NodeRub';

export default class PromptPopupRub extends ConfirmPopupRub {
    /**
     * Creates an instance of PromptPopup.
     * 
     * @param {any} node # node parent
     * @param {cc.Node} body # NodeRub options 
     * @param {any} [events={}]  # button events
     * {
     *  green : cc.Component.EventHandler || function(context)
     *  violet : cc.Component.EventHandler || function(context)
     * }
     * @param {any} options
     * @param {any} context
     * 
     * @memberOf PromptPopup
     */
    constructor(node, events = {}, options, context = null) {
        super(node, "", events.green || null, null, context);
    }

    init() {
        super.init();
        this.removeScrollView();
        this._addInputBody();
    }

    getVal() {
        return this.editboxBtn.getComponent(cc.EditBox).string;
    }

    _addInputBody() {
        let inputBgOptions = {
            name: 'inputbg',
            size: cc.size(1053.5714286, 289),
            // position: cc.v2(295, 39.1860692),
            scale: cc.v2(0.56, 0.56),
            layout: {
                type: cc.Layout.Type.VERTICAL,
                resizeMode: cc.Layout.ResizeMode.CONTAINER,
                padding: 10,
                spacingY: 10,
                verticalDirection: cc.Layout.VerticalDirection.TOP_TO_BOTTOM
            },
            widget: {
                top: 7.39,
                left: 0,
                right: 0,
                bottom: 85.77
            }
        };

        let lblOptions = {
            name: 'label',
            size: cc.size(inputBgOptions.size.width - 20, 60),
            // position: cc.v2(0, 104.5),
            widget: {
                left: 10,
                right: 10
            },
            label: {
                fontsize: 40,
                lineHeight: 40,
                text: 'Label:Label:Label',
                horizontalAlign: cc.Label.HorizontalAlign.LEFT,
                overflow: cc.Label.Overflow.CLAMP,
                enableWrapText: false
            }
        };

        let inputOptions = {
            name: 'editbox',
            size: cc.size(inputBgOptions.size.width - 40, 199.5),
            // position: cc.v2(-10, -34.75),
            editbox: {
                inputMode: cc.EditBox.InputMode.ANY,
                fontColor: new cc.Color(0, 0, 0)
            },
            widget: {
                left: 10,
                right: 30
            }
        };

        inputBgOptions.children = [lblOptions];

        this.editboxBtn = NodeRub.createNodeByOptions(inputOptions);

        let inputbg = NodeRub.createNodeByOptions(inputBgOptions);
        inputbg.addChild(this.editboxBtn);

        this.addToBody(inputbg);
    }

    //override
    static show(node, events = {}, options, context = null) {
        return new PromptPopupRub(node, events, options, context).init();
    }
}