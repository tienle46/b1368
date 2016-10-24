import app from 'app';
import utils from 'utils';
import Component from 'Component';

export default class TextView extends Component {
    constructor() {
        super();
        this.label = cc.Label;
        this.lines = 1;
        this.lineWidth = 100;
        this.maxWidth = 1000;
        this.lineHeight = 20;
        this.resizeWidth = true;
        this.text = "";
        this.isLoaded = false;
        this.increaseWidth = 40;
        this.padding = 5;
    }

    onLoad() {
        // console.log("onLoad textview: ", this.label.lineHeight);

        this.lineHeight = this.label.lineHeight;
        this.lineWidth = this.label.node.width;
        this.label.overflow = cc.Label.Overflow.RESIZE_HEIGHT;

        this.isLoaded = true;

        if(!utils.isEmpty(this.text)){
            this.setText(this.text);
            this.text = null;
        }
    }

    setIncreaseWidth(amount = 40){
        this.increaseWidth = amount;
    }

    setMaxWidth(maxWidth = 1000) {
        this.maxWidth = maxWidth - this.padding * 2;
    }

    setLineHeight(lineHeight = 20) {
        this.lineHeight = lineHeight;
        this._setTextViewSize();
    }

    setLines(lines) {
        this.lines = lines;
    }

    setFontSize(fontSize = 16) {
        this.label.fontSize = fontSize;
    }

    setText(text) {

        if(!this.isLoaded){
            this.text = text;
            return;
        }

        this._setTextViewSize();
        this.label.string = text;
        this._adjustSize();
    }

    _adjustSize() {

        let lines = Math.floor(this.label.node.height / this.lineHeight);
        // debug("label width: ", this.label.node.width, "lines: ", lines, "lineHeight: ", this.lineHeight);

        if (lines > this.lines) {
            if(this.resizeWidth){
                if (this.label.node.width <= this.maxWidth - this.increaseWidth) {
                    this.label.node.width += this.increaseWidth;
                    this.node.width = this.label.node.width + this.padding * 2;
                    this._adjustSize();
                }
            }else{
                if(fontSize > 8){
                    this.setFontSize(this.label.fontSize - 1);
                    this._adjustSize();
                }
            }
        }
    }

    _setTextViewSize() {
        this.label.node.width = this.lineWidth;
        this.label.node.height = this.lineHeight;
    }

    getWidth(){
        return this.label.node.width;
    }
}

app.createComponent(TextView);