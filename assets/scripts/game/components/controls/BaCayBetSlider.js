import app from 'app';
import Component from 'Component';

class BaCayBetSlider extends Component {
    constructor() {
        super();

        this.properties = {
            slider: cc.Slider,
            betAmount: cc.Label,
            bgNode: cc.Node,
            container: cc.Node
        };

        this.progress = null;
        this.range = [0, 0.2, 0.4, 0.6, 0.8, 1];
        this.amount = 1000;
    }

    onLoad() {
        this.initAmountLbl(this.amount);

        this.node.on(cc.Node.EventType.TOUCH_END, () => true);
        this.bgNode.on(cc.Node.EventType.TOUCH_END, (e) => {
            e.stopPropagation();
            this.hide();
            return true;
        });
        this.container.zIndex = 9999;
        this.container.on(cc.Node.EventType.TOUCH_END, () => true);
    }

    onSliderChange(e) {
        this.progress = this.range.sort((a, b) => Math.abs(e.progress - a) - Math.abs(e.progress - b))[0];

        // update lbl
        this.initAmountLbl((this.progress + 1) * this.getAmountNumber());
    }

    initAmountLbl(string) {
        this.betAmount.string = string || '0';
    }

    getAmountNumber() {
        return this.amount;
    }

    setAmountNumber(amount) {
        this.amount = amount;
    }

    hide() {
        this.node.opacity = 0;
    }

    show() {
        this.node.opacity = 255;
    }
}

app.createComponent(BaCayBetSlider);