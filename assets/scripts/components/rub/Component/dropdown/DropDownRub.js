import app from 'app';
import RubUtils from 'RubUtils';

export default class DropDownRub {
    /**
     * Creates an instance of DropDownRub.
     * @param @required target {cc.Node || cc.Component} represent to where dropdown clicked. 
     * @param {Array[{any}]} items : menu items
     * {
     *      size: {width, height} // item size
     *      align: {top, left, right, bottom: number
     *              verticalCenter, horizontalCenter, isOnBottom, isOnTop: boolean
     *      }
     *      event: cc.Component.EventHandler
     * }
     * @param {any} opts : menu options
     * {
     *      @required size: {width, height} // menu size
     *      @required type: number "vertical = 0 || |horizontal = 1" # define what kind of style you wanna use , default : 0
     *      @required arrow: {
     *                 @required direction: number [up: 0 || left: 1 || right: 2 || down: 3] # arrow direction
     *                 align: {} # same as above item's `align` property
     *      }
     * }
     * @memberOf DropDownRub
    
     */
    constructor(target, items, opts = {}) {
        let defaultOptions = {
            size: cc.size(280, 255),
            type: app.const.MENU.TYPE.VERTICAL,
            arrow: {
                direction: app.const.MENU.ARROW_DIRECTION.UP,
                align: {}
            }
        };

        this.options = Object.assign({}, defaultOptions, opts);

        if (!this.options.arrow.hasOwnProperty('align'))
            this.options.arrow.align = {};
        this.target = target instanceof cc.Node ? target : target.node;
        this.winsize = cc.director.getWinSize();
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

        this._setupPopupDirection();

        this._setupDropArrowDirection();
        this._setupDropArrowAlign();
    }

    _setupPopupDirection() {
        if (this.target) {
            let menuSize = this.menu.getContentSize();
            // target's local position
            let tp = this.target.getPosition();
            // target's position by world
            let tpw = this.target.parent.convertToWorldSpace(tp);
            // menu's position
            let mp = cc.v2(0, 0);

            // VERTICAL DIRECTION
            let marginY = menuSize.height / 2 + DropDownRub.PADDING_Y;
            if (tpw.y <= marginY) { // up
                mp.y = tp.y + marginY + 30;
            } else { // down
                mp.y = tp.y - marginY;
            }

            // VERTICAL DIRECTION
            // edge = [-640, 640] =>    [-640 ... -320 ... 0 ... +320 ... +640]
            //                           ----- L ----|---- C -----|---- R ----

            let marginX = DropDownRub.PADDING_X;
            mp.x = tp.x - marginX < -640 ? -630 : tp.x - marginX;

            this.menu.setPosition(mp);

            cc.warn('l', this.target.getPosition(), this.menu.getPosition());
            cc.warn('r', tpw, cc.window);
        }
    }

    // // VERTICAL DIRECTION
    // // assume winsize width equals 1280 -> edge = [-640, 640] =>
    // // [-640 ... -320 ... 0 ... +320 ... +640]
    // //  -- LEFT --|--- CENTER ---|-- RIGHT -- 
    // _detectHorizontalPopupEdge(target) {
    //     // LEFT [-640, -320]
    // }

    // // Assume window size = 1280 -> half size = [-640, 640]
    // // PaddingX = (marginX + 1/2 menu width)
    // // TargetX - PaddingX < -640 --> over edge
    // // TargetX + PaddingX > 640 --> over edge
    // _isOverEdgeInHorizontal() {
    //     let tx = this.target.getPosition().x;
    //     let menuWidth = this.menu.getContentSize().width;
    //     let px = menuWidth + DropDownRub.PADDING_X;
    //     // half size
    //     let hs = this.winsize.width / 2;

    //     return ((tx - DropDownRub.PADDING_X) < -hs) || ((tx + px) > hs);
    // }

    _setupDropArrowDirection() {
        if (this.arrowNode) {
            switch (this.options.arrow.direction) {
                case app.const.MENU.ARROW_DIRECTION.LEFT:
                    // rotate to arrow change rotation to -> [<]
                    this.arrowNode.rotation = -90;
                    break;
                case app.const.MENU.ARROW_DIRECTION.RIGHT:
                    // rotate to arrow change rotation to -> [>]
                    this.arrowNode.rotation = 90;
                    break;
                case app.const.MENU.ARROW_DIRECTION.DOWN:
                    // flipY -1 to arrow change rotation to -> [v]
                    this.arrowNode.rotation = 180;
                    break;
                default: // up -> [^]
                    this.arrowNode.rotation = 0;
                    break;
            }
        }
    }

    _setupDropArrowAlign() {
        if (this.arrowNode) {
            let align = {};
            let arrowOptions = this.options.arrow;


            switch (arrowOptions.direction) {
                case app.const.MENU.ARROW_DIRECTION.LEFT:
                case app.const.MENU.ARROW_DIRECTION.RIGHT:
                    if (!arrowOptions.align.hasOwnProperty('top') || !arrowOptions.align.hasOwnProperty('bottom')) {
                        align.verticalAlign = true;
                    }

                    if (arrowOptions.direction === app.const.MENU.ARROW_DIRECTION.LEFT) {
                        align.left = -12;
                    } else {
                        align.right = -12;
                    }
                    break;
                case app.const.MENU.ARROW_DIRECTION.UP:
                case app.const.MENU.ARROW_DIRECTION.DOWN:
                    if (!arrowOptions.align.hasOwnProperty('left') || !arrowOptions.align.hasOwnProperty('right')) {
                        align.horizontalAlign = true;
                    }

                    if (arrowOptions.direction === app.const.MENU.ARROW_DIRECTION.UP) {
                        align.top = -8;
                    } else {
                        align.bottom = -12;
                    }
                    break;
            }

            align = Object.assign({}, align, arrowOptions.align || {});
            console.debug('algn', align);
            RubUtils.addWidgetComponentToNode(this.arrowNode, align);
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
            size: cc.size(14, 13)
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
        options.align && RubUtils.addWidgetComponentToNode(node, options.align);

        return node;
    }
}

DropDownRub.PADDING_X = 30;
DropDownRub.PADDING_Y = 50;