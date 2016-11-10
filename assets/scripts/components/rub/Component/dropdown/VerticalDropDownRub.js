import app from 'app';
import DropDownRub from 'DropDownRub';
import ButtonScaler from 'ButtonScaler';
import ListItemBasicRub from 'ListItemBasicRub';

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
     * @memberOf VerticalDropDownRub
     */
    constructor(target, items = [], options = {}) {
        let defaultOptions = {
            size: cc.size(280, 255),
            type: app.const.MENU.TYPE.VERTICAL,
            arrow: {
                direction: app.const.MENU.ARROW_DIRECTION.UP,
                align: {}
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

            let i = new ListItemBasicRub(null, { padding: 10 });

            var el = {
                type: app.const.LIST_ITEM.TYPE.IMAGE,
                spriteFrame: item.icon || 'game/images/ingame_exit_icon',
                size: cc.size(42, 38),
                align: {
                    left: 15,
                    verticalCenter: true
                }
            };

            var el2 = {
                type: app.const.LIST_ITEM.TYPE.LABEL,
                text: item.content || 'Thoat2',
                fontSize: 30,
                fontLineHeight: 50,
                horizontalAlign: cc.Label.HorizontalAlign.LEFT,
                size: cc.size(200, 50),
                align: {
                    left: 35,
                    verticalCenter: true
                }
            };

            i.pushEl(el);
            i.pushEl(el2);

            // add btn
            let node = i.node();
            node.addComponent(cc.Button);

            node.addComponent(ButtonScaler);

            return i.node();
        });
    }
}