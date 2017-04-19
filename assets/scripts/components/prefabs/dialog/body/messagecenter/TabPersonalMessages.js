/**
 * Created by trungnt on 10/14/16.
 */
import app from 'app';
import TabMessages from 'TabMessages';
import Linking from 'Linking';

class TabPersonalMessages extends TabMessages {
    constructor() {
        super();
    }
    
    onEnable() {
        super.onEnable();
        this._showListMessagePanel();    
    }
    
    showDetailPanel(id, description) {
        this._hideListMessagePanel();
        this.itemMessageLbl.string = description;
        this._sendReadRequest(id, false);
    }
    
    //@override
    onDataChanged({messages = [], page} = {}) {
        messages && messages.length > 0 && this.displayMessages(this.listMessagePanel, messages.map(message => {
            let {id, title, msg, time, action, actionData, readed} = message;

            return this.createItemMessage(id, title, msg, time, action, actionData, readed);
        }));
    }
    
    _addGlobalListener() {
        super._addGlobalListener();
        app.system.addListener(app.commands.GET_PERSONAL_MESSAGES, this._onGetPersonalMessages, this);
    }

    _removeGlobalListener() {
        super._removeGlobalListener();
        app.system.removeListener(app.commands.GET_PERSONAL_MESSAGES, this._onGetPersonalMessages, this);
    }
    
    //@override
    _requestMessagesList(page = 1) {
        this._initRequest(app.commands.GET_PERSONAL_MESSAGES, page);
        this.showLoadingProgress();
    }
    
    _onGetPersonalMessages(data) {
        this.setLoadedData(data);        
    }
    
    _onActionBtnClick(id, action, data) {
        this.popup.hide();
        Linking.goTo(action, data);
        this._sendReadRequest(id, true);
    }
    
    _sendReadRequest(id, needRemoveAction = false) {
        app.service.send({
            cmd: app.commands.CHANGE_PERSONAL_MESSAGE_STATE,
            data: {
                id,
                action: needRemoveAction
            }
        });
    }
    
    createItemMessage(id, title, description, time, action, actionData, isReaded) {
        if(this.itemPrefab) {
            let message = cc.instantiate(this.itemPrefab);
            let itemEventComponent = message.getComponent('ItemMessage');
            itemEventComponent && itemEventComponent.createItemWithButton(id, title, description, time, action, this._onActionBtnClick.bind(this, id, action, actionData, itemEventComponent), isReaded, this.showDetailPanel.bind(this, id, description));
            return message;
        }
    }
}

app.createComponent(TabPersonalMessages);