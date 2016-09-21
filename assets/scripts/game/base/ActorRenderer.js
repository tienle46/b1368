/**
 * Created by Thanh on 9/15/2016.
 */

import Component from 'Component';

export default class ActorRenderer extends Component {
    constructor() {
        super();

        this.loaded = false;
    }

    _initUI() {

    }

    assign(prefab, componentName){
        if(!prefab || !componentName) return;

        let baseNode = cc.instantiate(prefab);
        this._assignPropertiesFrom(baseNode.getComponent(componentName));
        this.node.addChild(baseNode);
    }

    _assignPropertiesFrom(src){

        Object.getOwnPropertyNames(src).forEach(key => {
            if(!this[key] && src[key]){
                this[key] = src[key];
            }
        });
    }

    onLoad(){
        this.loaded = true;
    }
}