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
        this.initiated = false;
        this._eventEmitter = null;
        this.__pendingEmitEvents = null;
    }

    /**
     * Sub class must be call super.onLoad() to init Renderer of actor
     */
    onLoad() {
        this.renderData = {};
        this.__pendingEmitEvents = {};
        this._assertEmitter();
    }

    onEnable(renderer = this.renderer, renderData = this.renderData){
        this.renderer = renderer;
        this.renderData = {...renderData, actor: this};
        this.renderer && this.renderer._init(this.renderData);
        this._addGlobalListener();
    }

    start(){
        super.start();
        this.initiated = true;
        this._emitPendingEvent();
    }

    onDisable(){
        this._removeGlobalListener();
        this.removeAllListener();
    }

    _assertEmitter(){
        !this._eventEmitter && (this._eventEmitter = new Emitter());
    }


    /**
     * This func to add listener to handler data from server or a custom action into game system
     *
     * If event is belong to UI let use listener of cc.Node (node.on, node.off, node.emit, etc...) instead
     *
     * NOTE: Don't forget to add remove this event have been added into _removeGlobalListener func to avoid memory leak
     *
     * Example:
     *      [instanceof actor]._addGlobalListener('adminMessage', () => {
     *          //Show admin message
     *      })
     *
     * @abstract
     */
    _addGlobalListener(){
        this._assertEmitter();
    }

    /**
     * Use this func to remove listener from game system. System events will be remove from system by default
     * NOTE: Make sure that sub class implementation ```onDestroy``` method must be call ```super.onDestroy()```
     * Example:
     *      [instanceof actor]._removeGlobalListener('adminMessage', () => {
     *          //Show admin message
     *      })
     *
     * @abstract
     * @override
     */
    _removeGlobalListener(){
        this._assertEmitter();
    }

    emit(name, ...args){
        if(this.initiated){
            this._eventEmitter.emit(name, ...args);
        }else{
            this._assertPendingEmitEvents();
            !this.__pendingEmitEvents.hasOwnProperty(name) && (this.__pendingEmitEvents[name] = []);
            this.__pendingEmitEvents[name].push(args);
        }
    }

    _assertPendingEmitEvents(){
        !this.__pendingEmitEvents && (this.__pendingEmitEvents = {});
    }

    on(name, listener, context, priority){
        this._assertEmitter();
        this._eventEmitter.addListener(name, listener, context, priority);
    }

    off(eventName, listener, context){
        this._eventEmitter && this._eventEmitter.removeListener(eventName, listener, context);
    }

    removeAllListener(){
        this.off();
    }

    _emitPendingEvent(){
        this.__pendingEmitEvents && Object.getOwnPropertyNames(this.__pendingEmitEvents).forEach(name => {
            let argArr = this.__pendingEmitEvents[name];
            argArr && argArr.forEach(args => {
               this._eventEmitter.emit(name, ...args);
            });
        });

        this.__pendingEmitEvents = {};
    }
}