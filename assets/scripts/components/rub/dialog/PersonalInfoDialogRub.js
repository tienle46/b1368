import DialogRub from 'DialogRub';
import PersonalInfoDialog from 'PersonalInfoDialog';

export default class PersonalInfoDialogRub extends DialogRub {
    constructor(node, tabs, options) {
        super(node, tabs, options);
    }

    init() {
        super.init();
        this.personalInfoDialogComponent = this.prefab.addComponent(PersonalInfoDialog);
    }
}