import app from 'app';
import utils from 'utils';
import Component from 'Component';

export default class TextView extends Component {
    constructor() {
        super();
        this.label = cc.Label;
        this.lines = {
            default: 1,
            type: cc.Integer
        };
        this.minWidth = {
            default: 100,
            type: cc.Integer
        };

        this.maxWidth = {
            default: 1000,
            type: cc.Integer
        };

        this.resizeWidth = {
            default: true,
            type: cc.Boolean
        };

        this.increaseWidth = {
            default: 40,
            type: cc.Integer
        };

        this.margin = {
            default: 5,
            type: cc.Integer
        };

        this.currentWidth = 0;
        this.lineHeight = 20;
        this.isLoaded = false;
    }

    onLoad() {
        // console.log("onLoad textview: ", this.label.lineHeight);
        this.lineHeight = this.label.lineHeight;
        this.label.overflow = cc.Label.Overflow.RESIZE_HEIGHT;
        this.label.string = "";
        this.isLoaded = true;
        this.currentWidth = this.node.width;
    }

    onEnable(){
        if(!utils.isEmpty(this.text)){
            let text = this.text;
            this.text = null;
            this.setText(text);
        }
    }

    setMargin(margin){
        this.margin = margin;
    }

    setIncreaseWidth(amount = 40){
        this.increaseWidth = amount;
    }

    setMaxWidth(maxWidth = 1000) {
        this.maxWidth = maxWidth;
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

    _setNodeWidth(width){
        this.node.width = Math.max(this.currentWidth, width);
    }

    _adjustSize() {

        let lines = Math.floor(this.label.node.height / this.lineHeight);
        // debug("label width: ", this.label.node.width, "lines: ", lines);

        if (lines > this.lines) {
            if(this.resizeWidth){
                if (this.label.node.width <= this.maxWidth - this.increaseWidth) {
                    this.label.node.width += this.increaseWidth;
                    this._setNodeWidth(this.label.node.width + this.margin * 2);
                    // this.node.width = this.label.node.width + this.margin * 2;
                    this._adjustSize();
                }else{
                    this.label.node.width = this.maxWidth;
                    this._setNodeWidth(this.maxWidth + this.margin * 2);
                    // this.node.width = this.maxWidth + this.margin * 2;
                }
            }else{
                if(fontSize > 8){
                    this.setFontSize(this.label.fontSize - 1);
                    this._adjustSize();
                }
            }
        } else {
            this._setNodeWidth(this.label.node.width + this.margin * 2);
            // this.node.width = this.label.node.width + this.margin * 2;
        }
    }

    _setTextViewSize() {
        this.label.node.width = this.minWidth;
        this.label.node.height = this.lineHeight;
    }

    getWidth(){
        return this.label.node.width;
    }
}

app.createComponent(TextView);