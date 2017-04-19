/**
 * Created by trungnt on 10/14/16.
 */
import app from 'app';
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
    
    showDetailPanel(description) {
        this._hideListMessagePanel();
        this.itemMessageLbl.string = description;        
    }
    
    _addGlobalListener() {
        super._addGlobalListener();
        app.system.addListener(app.commands.GET_SYSTEM_MESSAGES, this._onGetSystemMessages, this);
    }

    _removeGlobalListener() {
        super._removeGlobalListener();
        app.system.removeListener(app.commands.GET_SYSTEM_MESSAGES, this._onGetSystemMessages, this);
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
            let itemEventComponent = message.getComponent('ItemMessage');
            itemEventComponent && itemEventComponent.createItem(id, title, description, time, isNew, this.showDetailPanel.bind(this, description));
            return message;
        }
    }
}

app.createComponent(TabSystemMessage);