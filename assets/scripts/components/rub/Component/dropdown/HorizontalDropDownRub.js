import app from 'app';
import DropDownRub from 'DropDownRub';
import NodeRub from 'NodeRub';

export default class HorizontalDropDownRub {
    /**
     * Creates an instance of HorizontalDropDownRub.
     * @param {cc.Node} target
     * @param {any} items
     * {
     *  icon: string,
     *  content: string || cc.Node
     *  event: cc.component.eventHandler
     * }
     * @param {any} options #dropDownRub options
     * {
     * 
     * }
     * @param {any} childrens # child elements options
     * {    
     *      btnWrap: {
     *          padding: 0,
     *          spacingY: 3
     *      },
     *      icon: {
     *          size: cc.size
     *      }
     *      label: {
     *          fontSize: number
     *          color: cc.Color
     *      }
     * }
     * @memberOf HorizontalDropDownRub
     */
    constructor(target, items = [], options = {}, childrens) {
        let defaultOptions = {
            color: new cc.Color(178, 101, 201),
            size: cc.size(360, 65),
            type: app.const.MENU.TYPE.HORIZONTAL,
            arrow: {
                direction: app.const.MENU.ARROW_DIRECTION.DOWN,
            }
        };

        this.options = Object.assign({}, defaultOptions, options);

        let defaultChildrenOptions = {
            layout: {
                padding: 24,
                spacingX: 0
            },
            btnWrap: {
                padding: 0,
                spacingY: 3
            },
            icon: {
                size: cc.size(22, 22)
            },
            label: {
                fontSize: 13,
                color: app.const.COLOR_WHITE
            }
        };

        this.childOptions = Object.assign({}, defaultChildrenOptions, childrens);

        this.items = this._initItems(items);
        this.dropDownRub = new DropDownRub(target, this.items, this.options);
    }

    node() {
        return this.dropDownRub.node();
    }

    _initItems(items) {
        let wrapbtnSize = cc.size((this.options.size.width - 2 * this.childOptions.layout.padding) / items.length, this.options.size.height - 25); // 25 = bgNodebgNode

        return items.map(item => {
            if (item instanceof cc.Node)
                return item;

            let buttonWrapOptions = {
                size: wrapbtnSize,
                button: {
                    event: item.event || null
                },
                layout: {
                    type: cc.Layout.Type.VERTICAL,
                    resizeMode: cc.Layout.ResizeMode.NONE,
                    spacingY: this.childOptions.btnWrap.spacingY,
                    padding: this.childOptions.btnWrap.padding,
                    verticalDirection: cc.Layout.VerticalDirection.TOP_TO_BOTTOM
                }
            };

            let buttonWrap = NodeRub.createNodeByOptions(buttonWrapOptions);

            let iconOptions = {
                size: this.childOptions.icon.size,
                sprite: {
                    spriteFrame: item.icon || 'game/images/ingame_exit_icon'
                },
                widget: {
                    horizontalCenter: true
                }
            };

            let iconNode = NodeRub.createNodeByOptions(iconOptions);
            buttonWrap.addChild(iconNode);

            let lblSize = cc.size(wrapbtnSize.width, wrapbtnSize.height - this.childOptions.icon.size.height - this.childOptions.btnWrap.padding * 2 - this.childOptions.btnWrap.spacingY);
            let labelOptions = {
                size: lblSize,
                color: this.childOptions.label.fontColor,
                label: {
                    text: item.content || 'Thoát',
                    fontSize: this.childOptions.label.fontSize,
                    lineHeight: lblSize.height,
                    horizontalALign: cc.Label.HorizontalAlign.CENTER,
                    verticalALign: cc.Label.VerticalAlign.CENTER,
                    overFlow: cc.Label.Overflow.CLAMP
                },
                widget: {
                    left: 0,
                    right: 0
                }
            }

            let labelNode = NodeRub.createNodeByOptions(labelOptions);
            buttonWrap.addChild(labelNode);

            return buttonWrap;
        });
    }
}