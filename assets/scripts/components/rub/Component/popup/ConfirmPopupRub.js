import AlertPopupRub from 'AlertPopupRub';

export default class ConfirmPopupRub extends AlertPopupRub {
    /**
     * Creates an instance of AlertPopupRub.
     * 
     * @param {cc.Node} node : where this popup will be added 
     * @param {string} [string=""] : popup content
     * @param {cc.Component.EventHandler || null || function } green Btn EventHandler
     * @param {cc.Component.EventHandler || null || function } violet Btn EventHandler
     * 
     * @memberOf AlertPopupRub
     */
    constructor(node, string = "", greenBtnEvent = null, violetBtnEvent = null, context = null) {
        super(node, string, greenBtnEvent, context);
        this.violetBtnEvent = violetBtnEvent;
    }

    init() {
        super.init();
        // registerEvent for violet Btn
        this._registerVioletBtnEvent();
    }

    _changeVioletBtnState() {
        this.groupBtn.changeVioletBtnState(true);
    }

    _registerVioletBtnEvent() {
        // this.violetBtn has setted own EventHandler already. (close popup);        
        if (this.violetBtnEvent) {
            this.groupBtn.setBtnEvent(this.violetBtn, this.violetBtnEvent, this.context);
        }
    }

    //override
    static show(node, string = "", greenBtnEvent = null, violetBtnEvent = null, context = null) {
        return new ConfirmPopupRub(node, string, greenBtnEvent, violetBtnEvent, context).init();
    }
}