import app from 'app';
import DropDownRub from 'DropDownRub';
import RubUtils from 'RubUtils';
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
     * @param {any} options
     * {
     * 
     * }
     * @memberOf HorizontalDropDownRub
     */
    constructor(target, items = [], options = {}) {
        let defaultOptions = {
            size: cc.size(450, 153),
            type: app.const.MENU.TYPE.HORIZONTAL,
            arrow: {
                direction: app.const.MENU.ARROW_DIRECTION.DOWN,
                align: {
                    right: 25
                }
            }
        };

        this.options = Object.assign({}, defaultOptions, options);
        this.items = this._initItems(items);
        this.dropDownRub = new DropDownRub(target, this.items, this.options);
    }

    node() {
        return this.dropDownRub.node();
    }

    _initItems(items) {
        return items.map(item => {
            if (item instanceof cc.Node)
                return item;

            let buttonWrapOptions = {
                size: cc.size(127, 115),
                button: {
                    event: null
                },
                layout: {
                    type: cc.Layout.Type.VERTICAL,
                    resizeMode: cc.Layout.ResizeMode.NONE,
                    padding: 15,
                    spacingY: 10,
                    verticalDirection: cc.Layout.VerticalDirection.TOP_TO_BOTTOM
                },
                widget: {
                    top: 6.5,
                    bottom: 6.5
                }
            };

            let buttonWrap = NodeRub.createNodeByOptions(buttonWrapOptions);

            let iconOptions = {
                size: cc.size(42, 38),
                sprite: {
                    spriteFrame: item.icon || 'game/images/ingame_exit_icon'
                },
                widget: {
                    horizontalCenter: true
                }
            };

            let iconNode = NodeRub.createNodeByOptions(iconOptions);
            buttonWrap.addChild(iconNode);

            let labelOptions = {
                size: cc.size(127, 50),
                label: {
                    text: item.content || 'Thoát',
                    fontSize: 30,
                    lineHeight: 50,
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