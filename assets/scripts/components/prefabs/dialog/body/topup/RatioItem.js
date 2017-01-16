import app from 'app';
import Actor from 'Actor';
import numeral from 'numeral';

class RatioItem extends Actor {
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

    onLoad() {
        super.onLoad();
    }

    initItem(number, ratio) {
        this.titleLbl.string = `${numeral(number).format('0,0')} VNĐ`;
        this.ratioLbl.string = `${numeral(number * ratio).format('0,0')} Xu`;
    }

    initItemWithoutRatio(number, got) {
        this.titleLbl.string = `${numeral(number).format('0,0')} VNĐ`;
        this.ratioLbl.string = `${numeral(got).format('0,0')} Xu`;
    }
}

app.createComponent(RatioItem);