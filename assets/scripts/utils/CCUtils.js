/**
 * Created by Thanh on 10/19/2016.
 */

export default class CCUtils {
    static isNode(node) {
        return !node && node instanceof cc.Node;
    }

    static isValid(target) {
        return cc.isValid(target);
    }

    static disable(node) {
        if (!node) return;

        if (node instanceof cc.Node) {
            node.enabled = false;
        } else {
            node.node && (node.node.enabled = false);
        }
    }

    static enable(node) {
        if (!node) return;

        if (node instanceof cc.Node) {
            node.enabled = true;
        } else {
            node.node && (node.node.enabled = true);
        }
    }

    static destroy(target) {
        return target && cc.isValid(target) && target.destroy();
    }

    static active(node, opacity) {
        CCUtils.setActive(node, true);
        if (opacity) {
            //TODO
        }
    }

    static deactive(node, opacity) {
        CCUtils.setActive(node, false);

        if (opacity) {
            //TODO
        }
    }

    static setActive(node, active, opacity) {
        if (!node) return;

        active = active ? true : false;

        if (node instanceof cc.Node) {
            node.active = active;
        } else {
            node.node && (node.node.active = active);
        }
    }

    static setVisible(node, visible, opacity) {
        this.setActive(node, visible, opacity);
    }

    /**
     * @param opacity {int}
     */
    static setOpacity(node, opacity) {
        node = node instanceof cc.Node ? node : (node.node || null);
        if (!node)
            return;
        node.opacity = opacity ? opacity : 0;
    }

    /**
     * @param opacity {boolean}
     */
    static setVisibility(node, visiblity) {
        let opacity = visiblity ? 255 : 0;
        CCUtils.setOpacity(node, opacity);
    }

    static hide(node, action = cc.hide()) {
        node = node && (node.node || node);
        node && node.runAction && node.runAction(action);
    }

    static show(node) {
        node = node.node || node;
        node && node.runAction && node.runAction(cc.show());
    }

    static getWorldPosition(node) {
        if (node) {
            return node.parent ? node.parent.convertToWorldSpaceAR(node) : cc.v2(node.getPosition().x, node.getPosition().y);
        } else {
            return cc.v2(0, 0);
        }
    }

    static addClickEvent(node, targetNode, componentClass, handlerFn) {
        let button = node && node.getComponent(cc.Button);
        button.clickEvents && button.clickEvents.push(CCUtils.createEventHandler(targetNode, componentClass, handlerFn));
    }

    static createEventHandler(targetNode, componentClass, handlerFn) {
        const eventHandler = new cc.Component.EventHandler();
        eventHandler.target = targetNode;
        eventHandler.component = componentClass.name;
        eventHandler.handler = handlerFn.name;
        return eventHandler;
    }

    static setAnchorPoint(node, x, y) {
        if (!node) return;

        node.setAnchorPoint(x, y);
        node.childrenCount > 0 && this.children.forEach(child => CCUtils.setAnchorPoint(child, x, y));
    }

    convertToCenterAnchor(node) {
        let anchor = node.getAnchorPoint();
    }

    /**
     * @param node node to find
     * @param type type want to find
     * @returns {Array|Array.<T>|*}
     */
    findChildByType(node, type) {
        return node && type ? node.children.filter(child => child instanceof type) : [];
    }

}