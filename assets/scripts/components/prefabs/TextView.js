import app from 'app';
import utils from 'PackageUtils';
import Component from 'Component';

export default class TextView extends Component {
    constructor() {
        super();
        this.currentWidth = 0;
        this.isLoaded = false;
        
        this.properties = this.assignProperties({
            lineHeight: 24,
            label: cc.Label,
            lines: 1,
            minWidth: 100,
            maxWidth: 1000,
            resizeWidth: true,
            increaseWidth: 40,
            margin: 5
        });
    }


    onLoad() {
        // log("onLoad textview: ", this.label.lineHeight);

        this.lineHeight = this.getLabelLineHeight();
        this.label.overflow = cc.Label.Overflow.RESIZE_HEIGHT;
        this.label.string = "";
            
        this.isLoaded = true;
        this.currentWidth = this.node.width;

    }

    getLabelLineHeight() {
        if (app.env.isBrowser()) {
            return this.label.lineHeight;
        }

        return this.lineHeight;

    }

    onEnable() {
        super.onEnable();
        this.fontSize = this.label.fontSize;
        if (!utils.isEmpty(this.text)) {
            let text = this.text;
            this.text = null;
            this.setText(text);
        }
    }

    setMargin(margin) {
        this.margin = margin;
    }

    setIncreaseWidth(amount = 40) {
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
        if (!this.isLoaded) {
            this.text = text;
            return;
        }

        this._setTextViewSize();
        this.label && (this.label.string = text);

        this._adjustSize();
    }

    _setNodeWidth(width) {
        this.node.width = Math.max(this.currentWidth, width);
    }

    _adjustSize() {

        if (!this.label) return;

        let lines = Math.floor(this.label.node.height / this.lineHeight);
        // debug("label width: ", this.label.node.width, "lines: ", lines);

        if (lines > this.lines) {
            if (this.resizeWidth) {
                if (this.label.node.width <= this.maxWidth - this.increaseWidth) {
                    this.label.node.width += this.increaseWidth;
                    this._setNodeWidth(this.label.node.width + this.margin * 2);
                    // this.node.width = this.label.node.width + this.margin * 2;
                    this._adjustSize();
                } else {
                    this.label.node.width = this.maxWidth;
                    this._setNodeWidth(this.maxWidth + this.margin * 2);
                    // this.node.width = this.maxWidth + this.margin * 2;
                }
            } else {
                if (this.fontSize > 8) {
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
        if (!this.label) return;
        this.label.node.width = this.minWidth;
        this.label.node.height = this.lineHeight;
        this.fontSize && (this.label.fontSize = this.fontSize);
    }

    getWidth() {
        return this.label.node.width;
    }
}

app.createComponent(TextView);