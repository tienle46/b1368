import app from 'app';
import Component from 'Component';
import utils from 'utils';

class BetSlider extends Component {
    constructor() {
        super();

        this.properties = {
            slider: cc.Slider,
            betAmountLabel: cc.Label,
            bgNode: cc.Node,
            container: cc.Node
        };

        this.minValue = 0;
        this.maxValue = 0;
        this.currentValue = 0;
        this._chooseAmount = 0;
    }

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_END, () => true);
        this.bgNode.on(cc.Node.EventType.TOUCH_END, (e) => {
            e.stopPropagation();
            this.hide();
            return true;
        });
        this.container.zIndex = 9999;
        this.container.on(cc.Node.EventType.TOUCH_END, () => true);
    }

    onEnable() {
        super.onEnable();
        this._setChooseAmount(this.currentValue);
    }

    onSliderChange(e) {
        
        console.log("e.progress: ", e.progress)

        
        this._setChooseAmount(this.minValue + Math.round(e.progress * (this.maxValue - this.minValue)));
    }

    _setChooseAmount(value){
        this._chooseAmount = !value || value < this.minValue ? this.minValue : value;
        this.betAmountLabel.string = `${this._chooseAmount}`;
    }

    getAmountNumber() {
        return this._chooseAmount;
    }

    hide() {
        utils.deactive(this.node, 0);
        utils.deactive(this.bgNode);
    }

    show(minValue, maxValue, currentValue, steps) {
        this.minValue = minValue;
        this.maxValue = maxValue;
        this.currentValue = currentValue || minValue;
        utils.active(this.node, 255);
        utils.active(this.bgNode);
    }
}

app.createComponent(BetSlider);