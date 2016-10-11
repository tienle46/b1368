import DialogRub from 'DialogRub';
import TopupDialog from 'TopupDialog';

export default class TopUpDialogRub extends DialogRub {
    constructor(node, tabOptions) {
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
}