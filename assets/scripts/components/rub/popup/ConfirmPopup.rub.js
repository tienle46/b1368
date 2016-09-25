import BasePopupRub from 'BasePopup.rub';

export default class ComfirmPopupRub extends BasePopupRub {
    /**
     * Creates an instance of AlertPopupRub.
     * 
     * @param {cc.Node} node : where this popup will be added 
     * @param {string} [string=""] : popup content
     * @param {cc.Component.EventHandler || null} greenBtnEvent
     * @param {cc.Component.EventHandler || null} violetBtnEvent
     * 
     * @memberOf AlertPopupRub
     */
    constructor(node, string = "", greenBtnEvent = null, violetBtnEvent = null) {
        super(node, string = "");
        this.greenBtnEvent = greenBtnEvent;
        this.violetBtnEvent = violetBtnEvent;
        this.registerEvent();
    }

    registerEvent() {
        if (this.greenBtnEvent) {
            this.greenBtn.clickEvents = [this.greenBtnEvent];
        }

        if (this.violetBtnEvent) {
            this.violetBtnEvent.clickEvents = [this.violetBtnEvent];
        } else {
            this.closePopup();
        }
    }
}