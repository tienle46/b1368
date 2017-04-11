import app from 'app';

const url = `${app.const.DIALOG_DIR_PREFAB}/messagecenter`;

const tabModels = [
    { title: 'Hệ thống', prefabPath: `${url}/tab_system_messages`, componentName: 'TabSystemMessage'},
    { title: 'Cá nhân', prefabPath: `${url}/tab_personal_messages`, componentName: 'TabPersonalMessages'},
    { title: 'Góp ý', prefabPath: `${url}/tab_feed_back`, componentName: 'TabFeedBack'}
];

export default class MessageCenterDialogRub {

    constructor() {
        let node = cc.instantiate(app.res.prefab.multiTabPopup);
        /**
         * @type {MultiTabPopup}
         */
        this.multiTabPopup = node.getComponent("MultiTabPopup");

        this.multiTabPopup.setTitle('Tin nhắn');
    }
    
    show(parentNode = cc.director.getScene(), options = {}){
        this.multiTabPopup.show({parentNode, tabModels, options});
    }
}

MessageCenterDialogRub.TAB_SYSTEM_MESSAGE_INDEX = 0;
MessageCenterDialogRub.TAB_PERSONAL_MESSAGE_INDEX = 1;
MessageCenterDialogRub.TAB_FEEDBACK_INDEX = 2;