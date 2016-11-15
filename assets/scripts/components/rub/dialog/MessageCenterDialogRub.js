import DialogRub from 'DialogRub';

export default class MessageCenterDialogRub extends DialogRub {
    constructor(node, tabOptions) {
        super(node, tabOptions);
    }

    init() {
        super.init();
        // this.exchangeDialogComponent = this.prefab.addComponent(ExchangeDialog);
    }

}