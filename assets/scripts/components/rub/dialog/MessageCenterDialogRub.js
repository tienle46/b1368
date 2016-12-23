import DialogRub from 'DialogRub';

export default class MessageCenterDialogRub extends DialogRub {
    constructor(node, tabs, options) {
        super(node, tabs, options);
    }

    init() {
        super.init();
        // this.exchangeDialogComponent = this.prefab.addComponent(ExchangeDialog);
    }

}