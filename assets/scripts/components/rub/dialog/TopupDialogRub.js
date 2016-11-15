import DialogRub from 'DialogRub';
import TopupDialog from 'TopupDialog';

const tabs = [{
    title: 'Thẻ cào',
    value: 'tab_card'
}, {
    title: 'SMS',
    value: 'tab_sms'
}, {
    title: 'IAP',
    value: 'tab_iap'
}, {
    title: 'kiot',
    value: 'tab_kiot'
}];


const defaultTopUpTabOptions = { tabs };

export default class TopUpDialogRub extends DialogRub {

    constructor(node, tabOptions = {}) {
        super(node, tabOptions);
    }

    init() {
        super.init();
        this.topupDialogComponent = this.prefab.addComponent(TopupDialog);
    }

    show(parentNode, tabOptions = defaultTopUpTabOptions, cb) {
        super.show(parentNode, defaultTopUpTabOptions, cb);
    }
}