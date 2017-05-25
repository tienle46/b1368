import app from 'app';
import Events from 'Events';

const url = `${app.const.DIALOG_DIR_PREFAB}/messagecenter`;

const tabModels = [
    { title: 'Hệ thống', prefabPath: `${url}/tab_system_messages`, componentName: 'TabSystemMessage'},
    { title: 'Cá nhân', prefabPath: `${url}/tab_personal_messages`, componentName: 'TabPersonalMessages'},
    { title: 'Góp ý', prefabPath: `${url}/tab_feed_back`, componentName: 'TabFeedBack'}
];


/**
 * TODO: MessageCenterDialogRub need to extend MultiTabPopup to override method
 */
export default class MessageCenterDialogRub {

    constructor() {
        let node = cc.instantiate(app.res.prefab.multiTabPopup);
        /**
         * @type {MultiTabPopup}
         */
        this.multiTabPopup = node.getComponent("MultiTabPopup");

        this.multiTabPopup.setTitle('Tin nhắn');

        let addGlobalListener = this.multiTabPopup._addGlobalListener;
        let removeGlobalListener = this.multiTabPopup._removeGlobalListener;

        addGlobalListener.bind(this.multiTabPopup)
        removeGlobalListener.bind(this.multiTabPopup)

        this.multiTabPopup._addGlobalListener = () => {
            addGlobalListener();

            app.system.addListener(Events.CHANGE_SYSTEM_MESSAGE_COUNT, this.onChangeSystemMessageCount, this)
            app.system.addListener(Events.CHANGE_USER_MESSAGE_COUNT, this.onChangeUserMessageCount, this)
        }

        this.multiTabPopup._removeGlobalListener = () => {
            removeGlobalListener();

            app.system.removeListener(Events.CHANGE_SYSTEM_MESSAGE_COUNT, this.onChangeSystemMessageCount, this)
            app.system.removeListener(Events.CHANGE_USER_MESSAGE_COUNT, this.onChangeUserMessageCount, this)
        }

    }

    onChangeUserMessageCount(count){
        this.multiTabPopup.setNotifyCountForTab(MessageCenterDialogRub.TAB_PERSONAL_MESSAGE_INDEX, count)
    }

    onChangeSystemMessageCount(count){
        this.multiTabPopup.setNotifyCountForTab(MessageCenterDialogRub.TAB_SYSTEM_MESSAGE_INDEX, count)
    }
    
    show(parentNode = cc.director.getScene(), options = {}){
        this.multiTabPopup.show({parentNode, tabModels, options});
    }
}

MessageCenterDialogRub.TAB_SYSTEM_MESSAGE_INDEX = 0;
MessageCenterDialogRub.TAB_PERSONAL_MESSAGE_INDEX = 1;
MessageCenterDialogRub.TAB_FEEDBACK_INDEX = 2;