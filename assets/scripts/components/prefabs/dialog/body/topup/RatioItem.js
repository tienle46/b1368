import app from 'app';
import DialogActor from 'DialogActor';
import Utils from 'Utils';

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
        this.titleLbl.string = `${Utils.numberFormat(number)} VNĐ`;
        this.ratioLbl.string = `${Utils.numberFormat(number * ratio)} ${app.res.string('game_currency_unit')}`;
    }

    initItemWithoutRatio(number, got) {
        this.titleLbl.string = `${app._.isNumber(number) ? Utils.numberFormat(number) : number} VNĐ`;
        this.ratioLbl.string = `${app._.isNumber(got) ? Utils.numberFormat(got) : got} ${app.res.string('game_currency_unit')}`;
    }
}

app.createComponent(RatioItem);