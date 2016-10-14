
import DialogRub from 'DialogRub';
import ExchangeDialog from 'ExchangeDialog';
import RubUtils from 'RubUtils';
import AlertPopupRub from 'AlertPopupRub';
import app from 'app';

export default class MessageCenterDialogRub extends DialogRub {
    constructor(node, tabOptions) {
        super(node, tabOptions);
    }

    init() {
        return super.init().then(() => {
            // this.exchangeDialogComponent = this.prefab.addComponent(ExchangeDialog);

            return null;
        }).catch(e => {
            console.error(e);
        });
    }

}