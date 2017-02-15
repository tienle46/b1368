import DialogRub from 'DialogRub';
import TopupDialog from 'TopupDialog';
import app from 'app';

export default class TopUpDialogRub {

    constructor(node) {

        this._initOptions();

        this.node = node;
        this.dialog = null;
        this.init();
    }

    _initOptions() {
        let url = `${app.const.DIALOG_DIR_PREFAB}/topup`;

        let tabs = [{
            title: 'Thẻ cào',
            value: `${url}/tab_card`,
        }, {
            title: 'SMS',
            value: `${url}/tab_sms`,
            hidden: !app.env.isBrowserTest()
        }, {
            title: 'IAP',
            value: `${url}/tab_iap`,
            hidden: !app.env.isBrowserTest()
        }, {
            title: 'Lịch sử',
            value: `${url}/tab_history`
        }];

        let options = {
            // itemHeight: 26.5
        };

        this.options = { tabs, options };
    }

    init() {
        this.dialog = new DialogRub(this.node, this.options.tabs, { title: 'Nạp Tiền' });
        this.topupDialogComponent = this.dialog.addComponent(TopupDialog);
    }

    static show(parentNode) {
        return new this(parentNode);
    }
}