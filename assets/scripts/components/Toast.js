/**
 * Created by Thanh on 10/25/2016.
 */

import app from 'app';
import Component from 'Component';
import ToastItem from 'ToastItem';

export default class Toast extends Component {

    constructor() {
        super();

        this.toastItemPrefab = cc.Prefab;
        this.toastList = cc.Node;
    }


    onLoad(){
        this.node.on('touchstart', () => true);
        cc.find('scrollView/scroll', this.node)
    }

    info(message, duration = Toast.SHORT_TIME){
        this._createToastItem(message, ToastItem.TYPE_MESSAGE, duration);
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
        let toastItem = toastItemNode.getComponent(ToastItem.name);
        toastItem._init({message, type, duration});
        this.toastList.addChild(toastItemNode);
    }
}

Toast.LONG_TIME = 10000;
Toast.SHORT_TIME = 10000;

app.createComponent(Toast);