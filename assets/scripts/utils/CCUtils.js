/**
 * Created by Thanh on 10/19/2016.
 */

import app from 'app';

export default class CCUtils {
    constructor() {
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
}