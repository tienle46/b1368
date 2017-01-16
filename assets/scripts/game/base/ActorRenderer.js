/**
 * Created by Thanh on 9/15/2016.
 */

import utils from 'utils';
import Component from 'Component';

const componentAbstractMethods = ['update', 'lateUpdate', 'onLoad', 'start', 'onEnable', 'onDisable', 'onDestroy', 'onFocusInEditor', 'onLostFocusInEditor'];

export default class ActorRenderer extends Component {
    constructor() {
        super();
        this.loaded = false;
        this.data = null;
    }

    _init(data){
        this.data = data;
        this.actor = data.actor;
    }

    assign(prefab, componentName) {
        if (!prefab || !componentName) return;

        let baseNode = cc.instantiate(prefab);
        this._assignPropertiesFrom(baseNode.getComponent(componentName));
        this.node.addChild(baseNode);
    }

    _assignPropertiesFrom(src) {

        Object.getOwnPropertyNames(src).forEach(key => {

            let srcValue = src[key];

            if (srcValue && !this[key] && !this.isComponentAbstractMethod(key)) {
                this[key] = src[key];
            }

            // if (!this[key] && src[key]) {
            //     this[key] = src[key];
            // }
        });
    }

    isComponentAbstractMethod(name) {
        return componentAbstractMethods.indexOf(name) >= 0;
    }
}