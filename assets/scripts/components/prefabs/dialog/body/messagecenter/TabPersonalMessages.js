/**
 * Created by trungnt on 10/14/16.
 */
import app from 'app';
import TabMessages from 'TabMessages';
import Events from 'GameEvents';

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
    
    /**
     * @override
     * 
     * @param {any} [{messages = [], page}={}] 
     * @memberof TabPersonalMessages
     */
    onDataChanged({messages = [], page} = {}) {
        messages && this.displayMessages(this.listMessagePanel, messages.map(message => {
            let {id, title, msg, time, action, actionData, readed} = message;

            return this.createItemMessage(id, title, msg, time, action, actionData, readed);
        }));
    }
    
    _addGlobalListener() {
        super._addGlobalListener();
        app.system.addListener(app.commands.GET_PERSONAL_MESSAGES, this._onGetPersonalMessages, this);
        app.system.addListener(app.commands.CHANGE_PERSONAL_MESSAGE_STATE, this._onPersonalMessageChanged, this);
        app.system.addListener(Events.ON_NEW_ADDED_PERSONAL_MESSAGE, this.onNewAddedPersonalMessage, this); // server send new message while dialog is displaying... -> update new
    }

    _removeGlobalListener() {
        super._removeGlobalListener();
        app.system.removeListener(app.commands.GET_PERSONAL_MESSAGES, this._onGetPersonalMessages, this);
        app.system.removeListener(app.commands.CHANGE_PERSONAL_MESSAGE_STATE, this._onPersonalMessageChanged, this);
        app.system.removeListener(Events.ON_NEW_ADDED_PERSONAL_MESSAGE, this.onNewAddedPersonalMessage, this);
    }
    
    onNewAddedPersonalMessage() {
        this._requestMessagesList();
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
        app.visibilityManager.goTo(action, data);
        this._data.messages && this._data.messages.some(message => {
            if(id == message.id && message.readed){
                this._sendReadRequest(id, true);
                return true;
            }
        })
    }
    
    _onPersonalMessageChanged(data) {
        let id = data.id;
        let result = data[app.keywords.RESPONSE_RESULT]

        if(result) {
            this._data.messages && this._data.messages.some(message => {
                if(message.id == id){
                    if(!message.readed){
                        app.system.emit(Events.CHANGE_PERSONAL_MESSAGE_COUNT, -1)
                    }
                    message.readed = true;
                    this.onDataChanged(this._data)
                    return true;
                }
            })
        }    
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