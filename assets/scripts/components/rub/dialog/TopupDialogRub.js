import DialogRub from 'DialogRub';
import TopupDialog from 'TopupDialog';
import app from 'app';

export default class TopUpDialogRub {

    constructor(node) {
        let url = `${app.const.DIALOG_DIR_PREFAB}/topup`;
        let tabs = [{
            title: 'Thẻ cào',
            value: `${url}/tab_card`
        }, {
            title: 'SMS',
            value: `${url}/tab_sms`

        }, {
            title: 'IAP',
            value: `${url}/tab_iap`
        }, {
            title: 'Lịch sử',
            value: `${url}/tab_history`
        }];

        let options = {
            // itemHeight: 26.5
        };

        this.options = { tabs, options };
        this.node = node;
        this.dialog = null;
        this.init();
    }

    init() {
        this.dialog = new DialogRub(this.node, this.options.tabs, { title: 'Nạp Tiền' });
        this.topupDialogComponent = this.dialog.addComponent(TopupDialog);
    }

    static show(parentNode) {
        return new this(parentNode);
    }
}