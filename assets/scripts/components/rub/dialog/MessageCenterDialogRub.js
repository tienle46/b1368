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
        this.__node = node;
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
            app.system.removeListener(Events.ON_MESSAGE_COUNT_CHANGED, this.onChangeMessageCount, this)
        }
        
        this.currentSystemMessageCount = app.context.systemMessageCount
        this.currentPersonalMessageCount = app.context.personalMessagesCount
    }

    onChangeMessageCount(){
        this.multiTabPopup._tabModels && this.multiTabPopup.setNotifyCountForTab(MessageCenterDialogRub.TAB_SYSTEM_MESSAGE_INDEX, app.context.systemMessageCount)
        this.multiTabPopup._tabModels && this.multiTabPopup.setNotifyCountForTab(MessageCenterDialogRub.TAB_PERSONAL_MESSAGE_INDEX, app.context.personalMessagesCount)
        
        if(this.currentSystemMessageCount < app.context.systemMessageCount) { // -> new message
            app.system.emit(Events.ON_NEW_ADDED_SYSTEM_MESSAGE)
        }
        
        if(this.currentPersonalMessageCount < app.context.personalMessagesCount) { // -> new message
            app.system.emit(Events.ON_NEW_ADDED_PERSONAL_MESSAGE)
        }
        
        this.currentSystemMessageCount = app.context.systemMessageCount;
        this.currentPersonalMessageCount = app.context.personalMessagesCount;
    }

    show(parentNode = cc.director.getScene(), options = {}){
        this.multiTabPopup.show({parentNode, tabModels, options});
    }
}

MessageCenterDialogRub.TAB_SYSTEM_MESSAGE_INDEX = 0;
MessageCenterDialogRub.TAB_PERSONAL_MESSAGE_INDEX = 1;
MessageCenterDialogRub.TAB_FEEDBACK_INDEX = 2;