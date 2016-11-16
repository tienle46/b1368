import app from 'app';
import DropDownRub from 'DropDownRub';
import ButtonScaler from 'ButtonScaler';
import ListItemBasicRub from 'ListItemBasicRub';
import NodeRub from 'NodeRub';

export default class VerticalDropDownRub {
    /**
     * Creates an instance of VerticalDropDownRub.
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
     * @param {any} childrens # child elements options
     * {    
     *      btnWrap: {
     *          padding: 0,
     *          spacingX: 3
     *      },
     *      icon: {
     *          size: cc.size
     *      }
     *      label: {
     *          fontSize: number
     *          color: cc.Color
     *      }
     * }
     * @memberOf VerticalDropDownRub
     */
    constructor(target, items = [], options = {}, childrens) {
        let defaultOptions = {
            color: new cc.Color(102, 1, 135),
            size: cc.size(178, 288),
            type: app.const.MENU.TYPE.VERTICAL,
            arrow: {
                direction: app.const.MENU.ARROW_DIRECTION.UP,
                align: {}
            }
        };

        this.options = Object.assign({}, defaultOptions, options);

        let defaultChildrenOptions = {
            layout: { // VERTICAL
                padding: 0,
                spacingY: 30
            },
            btnWrap: { // HORIZONTAL
                padding: 15,
                spacingX: 10
            },
            icon: {
                size: cc.size(34, 34)
            },
            label: {
                fontSize: 16,
                color: app.const.COLOR_YELLOW
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
        return items.map(item => {
            if (item instanceof cc.Node)
                return item;

            let i = new ListItemBasicRub(null, { padding: 10 });
            // add btn
            let node = i.node();
            NodeRub.addButtonComponentToNode(node, {
                event: item.event || null
            });
            let size = node.getContentSize();
            let layoutOptions = {
                type: cc.Layout.Type.HORIZONTAL,
                resizeMode: cc.Layout.ResizeMode.NONE,
                padding: 15,
                spacingX: 10,
                horizontalDirection: cc.Layout.HorizontalDirection.LEFT_TO_RIGHT
            };
            NodeRub.addLayoutComponentToNode(node, layoutOptions);

            var el = {
                type: app.const.LIST_ITEM.TYPE.IMAGE,
                spriteFrame: item.icon || 'game/images/ingame_exit_icon',
                size: this.childOptions.icon.size,
                align: {
                    left: 15,
                    verticalCenter: true
                }
            };

            var el2 = {
                type: app.const.LIST_ITEM.TYPE.LABEL,
                text: item.content || 'Thoat2',
                fontSize: this.childOptions.label.fontSize,
                fontLineHeight: size.height,
                horizontalAlign: cc.Label.HorizontalAlign.LEFT,
                size: cc.size(size.width - this.childOptions.icon.size.width - this.childOptions.btnWrap.padding * 2 - this.childOptions.btnWrap.spacingX, size.height),
                align: {
                    left: 35,
                    verticalCenter: true
                }
            };
            i.pushEls([el, el2]);


            // node.addComponent(cc.Button);
            // node.addComponent(ButtonScaler);

            return i.node();
        });
    }
}