import app from 'app';
import Component from 'Component';

class TextView extends Component {
    constructor() {
        super();
        this.label = cc.Label;
        this.lines = 1;
        this.lineWidth = 100;
        this.maxWidth = 1000;
        this.lineHeight = 20;
    }

    onLoad() {
        this.lineHeight = this.label.node.height;
        this.label.node.width = this.lineWidth;
        this.label.overflow = cc.Label.Overflow.RESIZE_HEIGHT;
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

    setFontSize(fontSize = 14) {
        this.label.fontSize = fontSize;
    }

    setText(text) {
        this._setTextViewSize();

        this.label.string = text;

        this._adjustSize();
    }

    _adjustSize() {
        let lines = this.label.node.height / this.lineHeight;
        if (lines > this.lines) {
            if (this.label.node.width <= this.maxWidth - 30) {
                this.label.node.width += 30;
                this._adjustSize();
            }
        }
    }

    _setTextViewSize() {
        this.label.node.width = this.lineWidth;
        this.label.node.height = this.lineHeight;
    }
}

app.createComponent(TextView);