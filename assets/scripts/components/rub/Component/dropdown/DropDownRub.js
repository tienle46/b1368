import app from 'app';
import NodeRub from 'NodeRub';

export default class DropDownRub {
    /**
     * Creates an instance of DropDownRub.
     * @param @required target {cc.Node || cc.Component} represent to where dropdown clicked. 
     * @param {Array[{cc.Node} || {any}]} items : menu items 
     * {
     *  @required icon: string,
     *  @required content: string || cc.Node
     *  @required event: cc.component.eventHandler
     * }
     * @param {any} opts : menu options
     * {    
     *      color : new cc.color # bgcolor
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
        this.items = items;
        this.winsize = cc.director.getWinSize();

        this.state = true;

        this._initNode();
    }

    node() {
        return this.menu;
    }

    toggle() {
        this.state = !this.state;
        this.menu && (this.menu.active = this.state);
    }

    _initNode() {
        let popupbg = new cc.Node();
        popupbg.setContentSize(cc.size(5000, 2200));
        popupbg.on(cc.Node.EventType.TOUCH_START, ((e) => {
            e.stopPropagationImmediate();
            this.toggle();
        }).bind(this));

        this.menu = new cc.Node();
        this.menu.setContentSize(this.options.size);
        this.menu.setAnchorPoint(cc.v2(0, 0.5));

        this.menu.addChild(popupbg);

        // node -> background node
        this.menu && this._initBackground();

        this.menu && this._initMenuItems();
    }

    _initMenuItems() {
        // menu node
        let nodeOptions = {
            name: 'menu'
        };

        let size = cc.size(this.bgNode.getContentSize().width, this.bgNode.getContentSize().height - 20);

        if (this.options.type === app.const.MENU.TYPE.VERTICAL) {
            nodeOptions = Object.assign(nodeOptions, {
                size: size,
                widget: {
                    top: 30,
                    left: 0,
                    right: 0,
                    bottom: 10
                },
                layout: {
                    type: cc.Layout.Type.VERTICAL,
                    resizeMode: cc.Layout.ResizeMode.NONE,
                    padding: 0,
                    spacingY: 30,
                    verticalDirection: cc.Layout.VerticalDirection.TOP_TO_BOTTOM
                }
            });
        } else {
            nodeOptions = Object.assign(nodeOptions, {
                size: cc.size(size.width, size.height + 5),
                widget: {
                    top: 15,
                    left: 0,
                    right: 0,
                    bottom: 10
                },
                layout: {
                    type: cc.Layout.Type.HORIZONTAL,
                    resizeMode: cc.Layout.ResizeMode.NONE,
                    padding: 24,
                    horizontalDirection: cc.Layout.HorizontalDirection.LEFT_TO_RIGHT
                }
            });
        }

        let node = NodeRub.createNodeByOptions(nodeOptions);
        this.items.forEach((item) => {
            node.addChild(item);
        });

        this.menu.addChild(node);
    }

    _initBackground() {
        let paddingTop = 10;

        // bgNode options
        let nodeOptions = {
            name: 'background',
            size: cc.size(this.options.size.width, this.options.size.height - paddingTop),
            opacity: 220,
            widget: {
                top: 5,
                bottom: 5,
                left: 0,
                right: 0
            }
        };

        // arrow node options
        let arrowNodeOptions = {
            name: 'arrow',
            color: this.options.color,
            sprite: {
                spriteFrame: 'game/images/menu-arrow-bg',
            },
            size: cc.size(14, 13),
        };

        // body node options
        let bodyPaddingTop = 5;
        let bodyNodeOptions = {
            name: 'body',
            color: this.options.color,
            sprite: {
                spriteFrame: 'game/images/menu-body-bg',
            },
            size: cc.size(nodeOptions.size.width, nodeOptions.size.width - bodyPaddingTop),
            widget: {
                top: bodyPaddingTop,
                left: 0,
                right: 0,
                bottom: 0
            },
        };


        nodeOptions.children = [arrowNodeOptions, bodyNodeOptions];


        this.bgNode = NodeRub.createNodeByOptions(nodeOptions);
        this.arrowNode = this.bgNode.getChildByName('arrow');
        this.bodyNode = this.bgNode.getChildByName('body');

        this._setupPopupAndArrow();

        this.menu.addChild(this.bgNode);
    }

    _setupPopupAndArrow() {
        this.target && this._setupPopupPosition();
        this.arrowNode && this._setupDropArrowDirection();
        this.arrowNode && this._setupDropArrowAlign();
    }

    _setupPopupPosition() {
        let menuSize = this.menu.getContentSize();
        // target's local position
        let tp = this.target.getPosition();
        // target's position by world
        let tpw = this.target.parent.convertToWorldSpace(tp);
        // menu's position
        let mp = cc.v2(0, 0);

        // BY VERTICAL ORIENTATION
        let marginY = menuSize.height / 2 + DropDownRub.PADDING_Y;
        if (tpw.y <= marginY) { // up
            mp.y = tp.y + marginY + 30;
        } else { // down
            mp.y = tp.y - marginY;
        }

        // BY HORIZONTAL ORIENTATION
        // edge = [-640, 640] => 
        //  [-640 ... -320 ... 0 ... +320 ... +640]
        //   ----- L ----|---- C -----|---- R ----

        let marginX = DropDownRub.PADDING_X;
        let x = tp.x - marginX;
        if (app._.inRange(x, -640, -320)) {
            x < -640 && (x = -630);
        } else if (app._.inRange(x, -320, 320)) {
            x -= menuSize.width / 2 - marginX;
        } else if (app._.inRange(x, 320, 640)) {
            if (x + menuSize.width > 640) {
                x -= menuSize.width - 2 * marginX;
            }
        }
        mp.x = x;

        this.menu.setPosition(mp);
    }

    _setupDropArrowDirection() {
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

    _setupDropArrowAlign() {
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
                    align.bottom = -13;
                }
                break;
        }

        align = Object.assign({}, align, arrowOptions.align || {});
        NodeRub.addWidgetComponentToNode(this.arrowNode, align);
    }
}

DropDownRub.PADDING_X = 30;
DropDownRub.PADDING_Y = 50;