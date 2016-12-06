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
    constructor(node, string = "", confirmBtnEvent = null, cancelBtnEvent = null, context = null) {
        super(node, string, confirmBtnEvent, context);
        this.cancelBtnEvent = cancelBtnEvent;
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
        if (this.cancelBtnEvent) {
            this.groupBtn.setBtnEvent(this.cancelBtn, this.cancelBtnEvent, this.context);
        }
    }

    //override
    static show(node, string = "", confirmBtnEvent = null, cancelBtnEvent = null, context = null) {
        (!node) && (node = cc.director.getScene());
        return new ConfirmPopupRub(node, string, confirmBtnEvent, cancelBtnEvent, context).init();
    }
}