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

PersonalInfoDialogRub.TAB_BUDDY_LIST_INDEX = 0;
PersonalInfoDialogRub.TAB_CHAT_INDEX = 1;
PersonalInfoDialogRub.TAB_TRANSFER_INDEX = 2;
PersonalInfoDialogRub.TAB_TRANSFER_HISTORY_INDEX = 3;