import app from 'app';
import RubUtils from 'RubUtils';

export default class DropDownRub {
    /**
     * Creates an instance of DropDownRub.
     * @param @required target {cc.Node} represent to where dropdown clicked. 
     * @param {Array[{any}]} items : menu items
     * {
     *      size: {width, height} // item size
     *      align: {top, left, right, bottom: number
     *              verticalCenter, isOnBottom, isOnTop: boolean
     *      }
     *      event: cc.Component.EventHandler
     * }
     * @param {any} opts : menu options
     * {
     *      @required size: {width, height} // menu size
     *      @required type: number "vertical = 0 || |horizontal = 1" # define what kind of style you wanna use , default : 0
     *      @required direction: number [top: 0 || left: 1 || right: 2 || bottom: 3] # arrow direction
     * }
     * @memberOf DropDownRub
    
     */
    constructor(target, items = [], opts) {
        let defaultOptions = {
            size: cc.size(280, 255),
            type: app.const.MENU.TYPE.VERTICAL,
            direction: app.const.MENU.DIRECTION.TOP
        };

        this.options = Object.assign({}, defaultOptions, opts);
        this.target = target;
        this._initNode();
    }

    node() {
        return this.menu;
    }

    _initNode() {
        this.menu = new cc.Node();
        this.menu.setContentSize(this.options.size);
        this.menu.setAnchorPoint(cc.v2(0, 0.5));

        // node -> background node
        this._initBackground(this.menu);

        this._setupDropArrowDirection();
    }

    _setupDropArrowDirection() {
        if (this.arrowNode && this.target) {

        }
    }

    _initBackground(parent) {
        let node = new cc.Node();
        let paddingTop = 10;
        let nodeOptions = {
            size: cc.size(this.options.size.width, this.options.size.height - paddingTop),
            align: {
                top: 5,
                bottom: 5,
                left: 0,
                right: 0
            }
        };
        node.opacity = 200;

        // widget
        RubUtils.addWidgetComponentToNode(node, nodeOptions.align);



        // arrow node
        let arrowNodeOptions = {
            spriteFrame: 'game/images/menu-arrow-bg',
            size: cc.size(14, 13),
            align: {
                top: -8,
                left: 25
            }
        };
        this.arrowNode = this._configurateBackgroundByOptions(arrowNodeOptions);
        node.addChild(this.arrowNode);


        // body node
        let bodyPaddingTop = 5;
        let bodyNodeOptions = {
            spriteFrame: 'game/images/menu-body-bg',
            size: cc.size(nodeOptions.size.width, nodeOptions.size.width - bodyPaddingTop),
            align: {
                top: bodyPaddingTop,
                left: 0,
                right: 0,
                bottom: 0
            }
        };
        this.bodyNode = this._configurateBackgroundByOptions(bodyNodeOptions);;
        node.addChild(this.bodyNode);

        parent.addChild(node);
    }

    /**
     * @param {any} options
     * {
     *  spriteFrame: string,
     *  size: cc.Size
     *  align: {top, left, right, bottom}
     * }
     * 
     * @return cc.Node
     */
    _configurateBackgroundByOptions(options) {
        let node = new cc.Node();

        node.setContentSize(options.size);

        // sprite
        let bodySprite = node.addComponent(cc.Sprite);
        RubUtils.loadSpriteFrame(bodySprite, options.spriteFrame, options.size);

        // widget
        RubUtils.addWidgetComponentToNode(node, options.align);

        return node;
    }
}