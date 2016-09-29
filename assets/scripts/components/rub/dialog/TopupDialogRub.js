import Dialog from 'Dialog';
import TopupDialog from 'TopupDialog';

export default class TopUpDialogRub extends Dialog {
    constructor(node, tabOptions) {
        super(node, tabOptions);
    }

    init() {
        return super.init().then(() => {
            this.topupDialogComponent = this.prefab.getComponent(TopupDialog);
            return null;
        });
    }

    static show(node, tabOptions) {
        return new TopUpDialogRub(node, tabOptions).init();
    }
}