/**
 * Created by Thanh on 10/25/2016.
 */

import app from 'app';
import Component from 'Component';
import ToastItem from 'ToastItem';

export default class Toast extends Component {

    constructor() {
        super();
        
        this.properties = this.assignProperties({
            toastItemPrefab : cc.Prefab,
            toastList : cc.Node,
        });
    }

    onEnable(){
        super.onEnable();
        this.node.on('touchstart', () => true);
    }

    info(message, duration = Toast.SHORT_TIME){
        this._createToastItem(message, ToastItem.TYPE_MESSAGE, duration || Toast.SHORT_TIME);
    }

    longInfo(message){
        this._createToastItem(message, ToastItem.TYPE_MESSAGE, Toast.LONG_TIME);
    }

    error(message){
        this._createToastItem(message, ToastItem.TYPE_ERROR, Toast.SHORT_TIME);
    }

    longError(message){
        this._createToastItem(message, ToastItem.TYPE_ERROR, Toast.LONG_TIME);
    }

    _createToastItem(message, type, duration){
        let toastItemNode = cc.instantiate(this.toastItemPrefab);
        if(toastItemNode) {
            let toastItem = toastItemNode.getComponent('ToastItem');
            toastItem._init({message, type, duration});
            this.toastList.addChild(toastItemNode);
        }
    }
}

Toast.SHORT_TIME = 4000;
Toast.LONG_TIME = 6000;
Toast.FOREVER = 10000000;

app.createComponent(Toast);