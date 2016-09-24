import BasePopupRub from 'BasePopup.rub';

export default class AlertPopupRub extends BasePopupRub {
    /**
     * Creates an instance of AlertPopupRub.
     * 
     * @param {cc.Node} node : where this popup will be added 
     * @param {string} [string=""] : popup content
     * @param {cc.Component.EventHandler || null} greenBtnEvent
     * 
     * @memberOf AlertPopupRub
     */
    constructor(node, string = "", greenBtnEvent = null) {
        super(node, string);
        this.greenBtnEvent = greenBtnEvent;
    }

    changeVioletBtnState() {
        console.log('changeVioletBtnState');
        this.groupBtn.changeVioletBtnState(false);
    }


    registerEvent() {
        if (this.greenBtnEvent) {
            this.greenBtn.clickEvents = [this.greenBtnEvent];
        } else {
            this.closePopup();
        }
    }

    //override
    static show(node, string) {
        return new AlertPopupRub(node, string).init().then((res) => {
            res.addToNode();
            res.changeVioletBtnState();
        }).catch((err) => {
            console.log('err', err);
        });
    }
}