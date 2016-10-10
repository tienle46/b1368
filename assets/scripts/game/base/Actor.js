/**
 * Created by Thanh on 9/15/2016.
 */

import app from 'app';
import Component from 'Component';
import Emitter from 'emitter'

export default class Actor extends Component {
    constructor() {
        super();

        this.renderer = null;
        this.renderData = null;
        this._isRegisterdListener;

        this._eventEmitter = new Emitter;
    }

    setRenderer(renderer){
        this.renderer = renderer;
    }

    /**
     * Sub class must be call super.onLoad() to init Renderer of actor
     */
    onLoad() {
        this.renderData = {...this.renderData, actor: this};
        this.renderer && this.renderer._initUI(this.renderData);
    }

    /**
     * This func to add listener to handler data from server or a custom action into game system
     *
     * If event is belong to UI let use listener of cc.Node (node.on, node.off, node.emit, etc...) instead
     *
     * NOTE: Don't forget to add remove this event have been added into _removeSystemListener func to avoid memory leak
     *
     * Example:
     *      [instanceof actor]._addSystemListener('adminMessage', () => {
     *          //Show admin message
     *      })
     *
     * @abstract
     */
    _addSystemListener(){
        if(this._isRegisterdListener){
            this._removeSystemListener();
        }

        this._isRegisterdListener = true;
    }

    /**
     * Use this func to remove listener from game system. System events will be remove from system by default
     * NOTE: Make sure that sub class implementation ```onDestroy``` method must be call ```super.onDestroy()```
     * Example:
     *      [instanceof actor]._removeSystemListener('adminMessage', () => {
     *          //Show admin message
     *      })
     *
     * @abstract
     */
    _removeSystemListener(){
        this._isRegisterdListener = false;
    }

    emit(name, ...args){
        this._eventEmitter.emit(name, ...args);
    }

    on(name, listener, context){
        this._eventEmitter.addListener(name, listener, context);
    }

    off(eventName, listener, context){
        this._eventEmitter.removeListener(eventName, listener, context);
    }

    removeAllListener(){
        this.off();
    }

    onDestroy(){
        this.removeAllListener();
        this._removeSystemListener();
    }
}