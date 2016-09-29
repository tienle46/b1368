import BasePopupRub from 'BasePopupRub';

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

    _changeVioletBtnState() {
        this.groupBtn.changeVioletBtnState(false);
    }


    _registerEvent() {
        if (this.greenBtnEvent) {
            this.groupBtn.setBtnEvent(this.greenBtnEvent);
        } else {
            this.closePopup();
        }
    }

    //override
    static show(node, string, greenBtnEvent = null) {
        return new AlertPopupRub(node, string, greenBtnEvent).init().then((self) => {
            self.addToNode();
            // must call after node's added
            self._changeVioletBtnState();
            if (greenBtnEvent)
                self._registerEvent();

            return self;
        }).catch((err) => {
            console.log('err', err);
        });
    }
}