import app from 'app';
import Utils from 'GeneralUtils'
import Component from 'Component';
import utils from 'PackageUtils';

class BetSlider extends Component {
    constructor() {
        super();

        this.properties = {
            sliderNode: cc.Slider,
            betAmountLabel: cc.Label,
            minValueLabel: cc.Label,
            maxValueLabel: cc.Label,
            timeLabel: cc.Label,
            titleLabel: cc.Label,
            bgNode: cc.Node,
            popupContentBgNode: cc.Node
        };

        this.minValue = 0;
        this.maxValue = 0;
        this.range = 0;
        this.currentValue = 0;
        this.timeout = 5;
        this.title = undefined;
        this._chooseAmount = 0;
        this._slider = null;
        this._progressBar = null;
        this._countDown = 5;
        this._submitOnHide = false;
        this.cb = null;

    }

    onLoad() {
        // this.node.on(cc.Node.EventType.TOUCH_END, () => true);
        // this.popupContentBgNode && this.node.on(cc.Node.EventType.TOUCH_END, () => true);
        // this.bgNode && this.bgNode.on(cc.Node.EventType.TOUCH_END, (e) => {
        //     e.stopPropagation();
        //     this.hide();
        //     return true;
        // });
    }

    onEnable() {
        super.onEnable();

        this._countDown = this.timeout;
        this._updateCountDown();

        this._slider = this.sliderNode.getComponent(cc.Slider);
        this._progressBar = this.sliderNode.getComponent(cc.ProgressBar);
        this.minValueLabel && (this.minValueLabel.string = `${this.minValue}`);
        this.maxValueLabel.string = `${this.maxValue}`;
        this.title && (this.titleLabel.string = this.title);
        this._setChooseAmount(this.currentValue);
        this._setSliderValue(this._toSliderValue(this.currentValue));
        this._countDown > 0 && (this._interval = setInterval(() => {
            if(this._countDown <= 0){
                this.hide();
                return;
            }

            this._countDown--;
            this._updateCountDown();

        }, 1000));
    }

    _updateCountDown(){
        this.timeLabel && (this.timeLabel.string = `${this._countDown}`);
    }

    _toSliderValue(value){
        value = Math.max(0, value - this.minValue);
        let sliderValue = this.range > 0 ? value / this.range : 0;

        return sliderValue || 0;
    }

    onDisable(){
        super.onDisable();
        this._interval && clearInterval(this._interval);
        this._submitOnHide && this.onClickSubmitButton();
        this._submitOnHide = false;
    }

    onSliderChange(e) {
        this._progressBar.progress = e.progress;
        this._setChooseAmount(this.minValue + Math.round(e.progress * (this.maxValue - this.minValue)));
    }

    _setChooseAmount(value) {
        this._chooseAmount = !value || value < this.minValue ? this.minValue : value;
        this.betAmountLabel.string = `${this._chooseAmount}`;
    }

    getAmountNumber() {
        return this._chooseAmount;
    }

    hide(summitValue) {
        utils.deactive(this.node, 0);
        if(utils.isFunction(this.cb) && app.context.getSelectedGame == app.const.gameCode.BA_CAY){
            this.cb(summitValue)
        }
    }

    onClickSetMaxValue(){
        this._setChooseAmount(this.maxValue);
        this._setSliderValue(1);
    }

    onClickSetMinValue(){
        this._setChooseAmount(this.minValue);
        this._setSliderValue(0);
    }

    onClickSubmitButton(){
        let newValue = this.currentValue != this._chooseAmount ? this._chooseAmount : (app.context.getSelectedGame == app.const.gameCode.BA_CAY ? undefined : this.currentValue);
        if(app.context.getSelectedGame == app.const.gameCode.BA_CAY) {
            this.hide(newValue)
        } else {
            utils.deactive(this.node, 0);
            this.cb.call(this.ctx, newValue);
        }
    }

    _setSliderValue(value = 0){
        this._slider.progress = value;
        this._progressBar.progress = value;
    }

    setMaxValue(maxValue){

        if(!Utils.isNumber(maxValue)) return;

        this.maxValue = maxValue;

        if(this.maxValue < this.minValue) {
            this.maxValue = this.minValue
            return;
        }

        this.maxValueLabel.string = `${this.maxValue}`;
        this.range = this.maxValue - this.minValue;
        if(this._chooseAmount > this.maxValue){
            this._setChooseAmount(this.maxValue)
        }

        let progressValue = this._chooseAmount / this.maxValue
        this._slider && (this._slider.progress = progressValue)
        this._progressBar && (this._progressBar.progress = progressValue)
    }

    changeMaxValue(amount){
        this.setMaxValue(this.maxValue + amount)
    }

    show({minValue = 0, maxValue = 0, ctx = null, currentValue = minValue, cb = null, timeout = 5, title, submitOnHide = false} = {}) {
        this.minValue = minValue;
        this.maxValue = maxValue;
        this.range = maxValue - minValue;
        this.currentValue = currentValue;
        this.timeout = timeout;
        this.title = title;
        this._submitOnHide = submitOnHide;
        this.cb = cb;
        this.ctx = ctx;
        
        utils.active(this.node, 255);
    }
    
    onDestroy() {
        super.onDestroy();
        
        this.cb = null;
        this.ctx = {};
    }
}

app.createComponent(BetSlider);