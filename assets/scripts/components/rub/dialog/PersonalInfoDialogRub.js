import DialogRub from 'DialogRub';
import PersonalInfoDialog from 'PersonalInfoDialog';

export default class PersonalInfoDialogRub extends DialogRub {
    constructor(node, tabOptions) {
        super(node, tabOptions);
    }

    init() {
        return super.init().then(() => {
            this.personalInfoDialogComponent = this.prefab.addComponent(PersonalInfoDialog);

            return null;
        }).catch(e => {
            console.error(e);
        });
    }
}