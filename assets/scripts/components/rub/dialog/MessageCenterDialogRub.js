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
        this.multiTabPopup.setComponentData({
            tabNotifyData: {
                [MessageCenterDialogRub.TAB_SYSTEM_MESSAGE_INDEX]:  app.context.systemMessageCount,
                [MessageCenterDialogRub.TAB_PERSONAL_MESSAGE_INDEX]: app.context.personalMessagesCount
            }
        })

        this.multiTabPopup._addGlobalListener = () => {
            app.system.addListener(Events.ON_MESSAGE_COUNT_CHANGED, this.onChangeMessageCount, this)
        }

        this.multiTabPopup._removeGlobalListener = () => {
            app.system.removeListener(Events.CHANGE_PERSONAL_MESSAGE_COUNT, this.onChangeMessageCount, this)
        }
    }

    onChangeMessageCount(){
        this.multiTabPopup.setNotifyCountForTab(MessageCenterDialogRub.TAB_SYSTEM_MESSAGE_INDEX, app.context.systemMessageCount)
        this.multiTabPopup.setNotifyCountForTab(MessageCenterDialogRub.TAB_PERSONAL_MESSAGE_INDEX, app.context.personalMessagesCount)
    }

    show(parentNode = cc.director.getScene(), options = {}){
        this.multiTabPopup.show({parentNode, tabModels, options});
    }
}

MessageCenterDialogRub.TAB_SYSTEM_MESSAGE_INDEX = 0;
MessageCenterDialogRub.TAB_PERSONAL_MESSAGE_INDEX = 1;
MessageCenterDialogRub.TAB_FEEDBACK_INDEX = 2;