import app from 'app';
import Utils from 'GeneralUtils'
import Component from 'Component';
import utils from 'PackageUtils';
import {formatBalanceShort} from 'GameUtils'

class BetSlider extends Component {
    constructor() {
        super();

        this.properties = {
            slider: cc.Slider,
            progressBar: cc.ProgressBar,
            toolTipLbl: cc.Label,
            minBtn: cc.Button,
            ga1Btn: cc.Button,
            ga2Btn: cc.Button,
            allInBtn: cc.Button
        };
        this.currentValue = 0
    }

    onLoad() {
        super.onLoad()
        
        // this.show({userMoney: 11125, divisor: 500, minValue: 1234, boardValue: 1000})
    }

    onEnable() {
        super.onEnable();
        this.currentValue = Math.min(this._minValue, this._userMoney)
        this.setToolTip(0)
    }
    
    onDisable() {
        this.progressBar.progress = 0
        this.slider.progress = 0  
    }
    
    onSliderChange(e) {
        this.progressBar.progress = e.progress;        
        const value = this.progressBar.progress * this._range
            
        this.setToolTip(value)
    }
    
    setValues({minValue, boardValue}) {
        if(minValue) {
            this._minValue = minValue
            this._range = this._userMoney - this._minValue
            
            this.currentValue = Math.min(this._minValue, this._userMoney)
            this.setToolTip(0)
        }
        
        this._boardValue = boardValue
    }
    
    onMinBtnClicked() {
        this._calculate(0)
    }
    
    on1GaBtnClicked() {
        this._calculate(this._boardValue, true)
    }
    
    on2GaBtnClicked() {
        this._calculate(this._boardValue * 2, true)
    }
    
    onAllInBtnClicked() {
        this._calculate(this._userMoney)
    }
    
    _calculate(val, isBoard) {
        let ratio = this._range ? val / this._range : 1
        ratio = ratio > 1 ? 1 : ratio

        this.progressBar.progress = ratio
        this.slider.progress = ratio
        let value = this.progressBar.progress * this._range
        this.setToolTip(value, isBoard)    
    }
    
    hide() {
        utils.deactive(this.node, 0);
    }
    
    show({divisor, userMoney, minValue, boardValue}) {
        this._minValue = minValue
        this._divisor = divisor
        this._userMoney = userMoney
        this._range = userMoney - minValue
        this._boardValue = boardValue
        
        if(this._range <= 0) {
            // this.progressBar.progress = 1
            // this.slider.progress = 1
            // this.slider.enabled = false    
            this._range = 0
            this._divisor = userMoney
        }

        utils.active(this.node, 255);
    }
    
    getCurrentValue() {
        return this.currentValue
    }
    
    setToolTip(progressBarValue, isBoard = false) {
        let multiples = Math.round(progressBarValue / this._divisor)
        this.currentValue = (isBoard ? 0 : Math.min(this._minValue, this._userMoney)) + this._divisor * multiples
            
        this.toolTipLbl.string = formatBalanceShort(this.currentValue)

        if((this.currentValue >= this._userMoney || this._minValue + progressBarValue >= this._userMoney) && this.progressBar.progress === 1) {
            this.currentValue = this._userMoney
            this.toolTipLbl.string = 'All-in'
        } 
    }
    
    onHandleBtnClicked() {
        // console.warn(this.currentValue)        
    }
    
    onDestroy() {
        super.onDestroy();
    }
}

app.createComponent(BetSlider);