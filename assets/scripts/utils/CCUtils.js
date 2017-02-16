/**
 * Created by Thanh on 10/19/2016.
 */

export default class CCUtils {
    constructor() {
    }

    static getWorldPosition(node){
        if(node){
            return node.parent ? node.parent.convertToWorldSpaceAR(node) : cc.v2(node.getPosition().x, node.getPosition().y);
        }else{
            return cc.v2(0, 0);
        }
    }

    static addClickEvent(node, targetNode, componentClass, handlerFn){
        let button = node && node.getComponent(cc.Button);
        button.clickEvents && button.clickEvents.push(CCUtils.createEventHandler(targetNode, componentClass, handlerFn));
    }

    static createEventHandler(targetNode, componentClass, handlerFn){
        const eventHandler = new cc.Component.EventHandler();
        eventHandler.target = targetNode;
        eventHandler.component = componentClass.name;
        eventHandler.handler = handlerFn.name;
        return eventHandler;
    }

    static setAnchorPoint(node, x, y){
        if(!node) return;

        node.setAnchorPoint(x, y);
        node.childrenCount > 0 && this.children.forEach(child => CCUtils.setAnchorPoint(child, x, y));
    }

    convertToCenterAnchor(node){
        let anchor = node.getAnchorPoint();
    }

    /**
     * @param node node to find
     * @param type type want to find
     * @returns {Array|Array.<T>|*}
     */
    findChildByType(node, type){
        return node && type ? node.children.filter(child => child instanceof type) : [];
    }

}