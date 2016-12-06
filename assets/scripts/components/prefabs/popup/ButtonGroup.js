import app from 'app';
import Component from 'Component';

/**
 * @class ButtonGroup
 * @extends {Component}
 * Controls position of groupBtn when it has 1 or 2 button in layout
 */
class ButtonGroup extends Component {
    constructor() {
        super();
        this.greenBtn = cc.Button;
        this.violetBtn = cc.Button;
    }

    // use this for initialization
    onLoad() {
        this.resetWidget = this.node.getComponent(cc.Widget);
        this._setGreenBtnLabel();
        this._setVioletBtnLabel();
    }

    changeVioletBtnState(state) {
        this.violetBtn && (this.violetBtn.node.active = state);
    }

    /**
     * add an event to btn
     * @param {any} cc.Component.EventHandler
     * 
     * @memberOf ButtonGroup
     */
    setBtnEvent(btn, eventHandler, context) {
        if (eventHandler instanceof cc.Component.EventHandler) {
            btn.clickEvents = [eventHandler];
        } else if (eventHandler instanceof Function) {
            let event;
            if (context)
                event = eventHandler.bind(context);
            else
                event = eventHandler;
            btn.node.on(cc.Node.EventType.TOUCH_END, event);
        }
    }

    /**
     * push an event to btn
     * @param {any} cc.Component.EventHandler
     * 
     * @memberOf ButtonGroup
     */
    pushBtnEvent(btn, eventHandler) {
        btn.clickEvents.push(eventHandler);
    }

    /**
     * unshift an event to btn
     * @param {any} cc.Component.EventHandler
     * 
     * @memberOf ButtonGroup
     */
    unshiftBtnEvent(btn, eventHandler) {
        // sometimes we want an event runs before close Btn
        btn.clickEvents.unshift(eventHandler);
    }

    _setGreenBtnLabel(string = "Đồng ý".toUpperCase()) {
        this.greenBtn.node.getChildByName('Label').getComponent(cc.Label).string = string;
    }

    _setVioletBtnLabel(string = "Hủy".toUpperCase()) {
        this.violetBtn.node.getChildByName('Label').getComponent(cc.Label).string = string;
    }
}

app.createComponent(ButtonGroup);