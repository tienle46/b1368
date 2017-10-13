/**
 * Created by trungnt on 10/14/16.
 */
import app from 'app';
import Events from 'GameEvents';
import TabMessages from 'TabMessages';

class TabSystemMessage extends TabMessages {
    constructor() {
        super();
    }
    
    onEnable() {
        super.onEnable();
        this._showListMessagePanel();
        // this.setLoadingData();
    }
    
    onDataChanged({messages = [], page} = {}) {
        messages && messages.length > 0 && this.displayMessages(this.listMessagePanel, messages.map(message => {
            let {
                id,
                title,
                msg,
                time,
                isNew
            } = message;
            return this.createItemMessage(id, title, msg, time, isNew);
        }));
    }
    
    showDetailPanel(id, description, isNew) {
        this._hideListMessagePanel();
        this.itemMessageLbl.string = description; 
        isNew && this._sendReadRequest(id);       
    }
    
    _sendReadRequest(id) {
        app.service.send({
            cmd: app.commands.CHANGE_SYSTEM_MESSAGE_STATE,
            data: {
                id
            }
        });
    }
    
    _addGlobalListener() {
        super._addGlobalListener();
        app.system.addListener(app.commands.GET_SYSTEM_MESSAGES, this._onGetSystemMessages, this);
        app.system.addListener(app.commands.CHANGE_SYSTEM_MESSAGE_STATE, this._onSystemMessageChanged, this);
        app.system.addListener(Events.ON_NEW_ADDED_SYSTEM_MESSAGE, this.onNewAddedPersonalMessage, this); // server send new message while dialog is displaying... -> update new

    }

    _removeGlobalListener() {
        super._removeGlobalListener();
        app.system.removeListener(app.commands.GET_SYSTEM_MESSAGES, this._onGetSystemMessages, this);
        app.system.removeListener(app.commands.CHANGE_SYSTEM_MESSAGE_STATE, this._onSystemMessageChanged, this);
        app.system.removeListener(Events.ON_NEW_ADDED_SYSTEM_MESSAGE, this.onNewAddedPersonalMessage, this); // server send new message while dialog is displaying... -> update new
    }

    _onSystemMessageChanged(data) {
        let id = data.id;
        let result = data[app.keywords.RESPONSE_RESULT]

        if(result) {
            this._data.messages && this._data.messages.some(message => {
                if(message.id == id){
                    if(message.isNew){
                        app.system.emit(Events.CHANGE_SYSTEM_MESSAGE_COUNT, -1)
                    }
                    message.isNew = false;
                    this.onDataChanged(this._data)
                    return true;
                }
            })
        }
    }

    _requestMessagesList(page = 1) {
        this._initRequest(app.commands.GET_SYSTEM_MESSAGES, page);
        this.showLoadingProgress();
    }
    
    _onGetSystemMessages(data) {
        this.setLoadedData(data);        
    }
    
    createItemMessage(id, title, description, time, isNew) {
        if(this.itemPrefab) {
            let message = cc.instantiate(this.itemPrefab);
            message.active = false;
            let itemEventComponent = message.getComponent('ItemMessage');
            itemEventComponent && itemEventComponent.createItem(id, title, description, time, isNew, this.showDetailPanel.bind(this, id, description, isNew));
            return message;
        }
    }
}

app.createComponent(TabSystemMessage);