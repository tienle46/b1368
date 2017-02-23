import app from 'app';
import DialogActor from 'DialogActor';
import numeral from 'numeral';

class RatioItem extends DialogActor {
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
        this.ratioLbl.string = `${numeral(number * ratio).format('0,0')} ${app.res.string('game_currency_unit')}`;
    }

    initItemWithoutRatio(number, got) {
        this.titleLbl.string = `${app._.isNumber(number) ? numeral(number).format('0,0') : number} VNĐ`;
        this.ratioLbl.string = `${app._.isNumber(got) ? numeral(got).format('0,0') : got} ${app.res.string('game_currency_unit')}`;
    }
}

app.createComponent(RatioItem);