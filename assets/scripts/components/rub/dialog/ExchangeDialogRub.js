import DialogRub from 'DialogRub';
import ExchangeDialog from 'ExchangeDialog';

export default class ExchangeDialogRub extends DialogRub {
    constructor(node, tabOptions) {
        super(node, tabOptions);
    }

    init() {
        return super.init().then(() => {
            this.exchangeDialogComponent = this.prefab.addComponent(ExchangeDialog);

            return null;
        }).catch(e => {
            console.error(e);
        });
    }
}