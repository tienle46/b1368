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

const options = {
    itemHeight: 26.5
};

const defaultTopUpTabOptions = { tabs, options };

export default class TopUpDialogRub extends DialogRub {

    constructor(node, tabOptions = defaultTopUpTabOptions) {
        super(node, tabOptions);
    }

    init() {
        return super.init().then(() => {
            this.topupDialogComponent = this.prefab.addComponent(TopupDialog);
            return null;
        }).catch(e => {
            error(e);
        });
    }

    show(parentNode, tabOptions = defaultTopUpTabOptions){
        super.show(parentNode, defaultTopUpTabOptions);
    }
}