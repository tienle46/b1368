import DialogRub from 'DialogRub';
import PersonalInfoDialog from 'PersonalInfoDialog';

export default class PersonalInfoDialogRub extends DialogRub {
    constructor(node, tabOptions) {
        super(node, tabOptions);
    }

    init() {
        super.init();
        this.personalInfoDialogComponent = this.prefab.addComponent(PersonalInfoDialog);
    }
}