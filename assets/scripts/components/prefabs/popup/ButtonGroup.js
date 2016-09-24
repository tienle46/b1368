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
        console.log("wtf onload ?");
        this.resetWidget = this.node.getComponent(cc.Widget);
        this.setGreenBtnLabel();
        this.setVioletBtnLabel();
    }

    setGreenBtnLabel(string = "Đồng ý".toUpperCase()) {
        this.greenBtn.node.getChildByName('Label').getComponent(cc.Label).string = string;
    }

    setVioletBtnLabel(string = "Hủy".toUpperCase()) {
        this.violetBtn.node.getChildByName('Label').getComponent(cc.Label).string = string;
    }

    changeVioletBtnState(state) {
        console.log('XXSS')
        this.violetBtn.active = state;
    }

    // center alignment while button change states
    resetWidget() {
        // this.resetWidget
    }
}

app.createComponent(ButtonGroup);