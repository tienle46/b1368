import app from 'app';
import Component from 'Component';

class RatioItem extends Component {
    constructor() {
        super();

        this.titleLbl = {
            default: null,
            type: cc.Label
        };

        this.ratioLbl = {
            default: null,
            type: cc.Label
        };
    }

    onLoad() {}

    initItem(number, ratio) {
        this.titleLbl.string = `${number.toLocaleString()} VNĐ`;
        this.ratioLbl.string = `${(number * ratio).toLocaleString()} Xu`;
    }

    initItemWithoutRatio(number, got) {
        this.titleLbl.string = `${number.toLocaleString()} VNĐ`;
        this.ratioLbl.string = `${(got).toLocaleString()} Xu`;
    }
}

app.createComponent(RatioItem);