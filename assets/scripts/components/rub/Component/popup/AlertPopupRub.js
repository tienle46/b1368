import BasePopupRub from 'BasePopupRub';

export default class AlertPopupRub extends BasePopupRub {
    /**
     * Creates an instance of AlertPopupRub.
     * 
     * @param {cc.Node} node : where this popup will be added 
     * @param {string} # popup content
     * @param {cc.Component.EventHandler || Function || null} green Btn EventHandler
     * @param {any} context of EventHandler while its type is Function
     * 
     * @memberOf AlertPopupRub
     */
    constructor(node, string = "", confirmBtnEvent = null, context = null) {
        super(node, string);
        this.confirmBtnEvent = confirmBtnEvent;
        this.context = context;
        this.NAME = 'alert_popup';
    }

    init() {
        super.init();
        this._changeVioletBtnState();
        this._registerEvent();
    }


    _changeVioletBtnState() {
        this.groupBtn && this.groupBtn.changeVioletBtnState(false);
    }

    _registerEvent() {
        // this.greenBtn has setted own EventHandler already. (close popup);        
        if (this.confirmBtnEvent && this.groupBtn) {
            this.groupBtn.setBtnEvent(this.confirmBtn, this.confirmBtnEvent, this.context);
        }
    }

    //override
    static show(node, string, confirmBtnEvent = null, context = null) {
        (!node) && (node = cc.director.getScene());

        return new AlertPopupRub(node, string, confirmBtnEvent, context).init();
    }
}