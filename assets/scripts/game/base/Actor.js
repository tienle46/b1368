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
        this.rendererClassName = null;
        this.renderData = null;
        this.renderComponent = null;

        this._eventEmitter = new Emitter;
    }

    setRenderer(renderer){
        this.renderer = renderer;
    }

    /**
     * Subclass must be call this method before onLoad call first time. If not, renderer of this actor cannot
     * created and all logic code to update the renderer will be hit error or exception.
     *
     * If you are inherit multi levels you can override this method and call super._setRenderer and pass params into it,
     * or init two properties rendererClassName && renderData in constructor.
     * On first time onLoad called, if two properties haven't initiated, _initRenderer will be call with out params passed to.
     *
     * NOTE: You make sure that all onLoad override method in subclass must be call super.onLoad() in the body
     *
     * @param rendererClassName
     * @param renderData
     * @private
     */
    _setRenderer(rendererClassName, renderData = {}){
        this.rendererClassName = rendererClassName;
        this.renderData = renderData;
    }

    /**
     * Sub class must be call super.onLoad() to init Renderer of actor
     */
    onLoad() {
        this.renderData = {...this.renderData, actor: this};
        this.renderer && this.renderer._initUI(this.renderData);
    }

    emit(name, ...args){
        this._eventEmitter.emit(name, ...args);
    }

    on(name, listener, context){
        this._eventEmitter.on(name, listener.bind(context));
    }

    plug(adapter){
        this.adapter = adapter;

    }
}