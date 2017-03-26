/**
 * Created by trungnt on 10/14/16.
 */
import app from 'app';
import TabMessages from 'TabMessages';

class TabPersonalMessages extends TabMessages {
    constructor() {
        super();
    }
    
    onLoad() {
        this.groupType = app.const.DYNAMIC_GROUP_SYSTEM_MESSAGE;
        super.onLoad();
    }
    
    start() {
        super.start();
        let messages = [
            {
                title: 'Nhận được 5000.000 Chips từ người chơi',
                msg: 'Bạn nhận được <color=#a6b7c7>5000.000</color> từ người chơi abcdef. Ấn <color=#a6b7c7>5000.000</color> để nhận xu nhé. Bạn nhận được <color=#a6b7c7>5000.000</color> từ người chơi abcdef. Ấn xyz để nhận xu nhé. Bạn nhận được <color=#a6b7c7>5000.000</color> từ người chơi abcdef. Ấn xyz để nhận xu nhé.',
                readed: true,
                action: "TOPUP",
                actionData: "jsonData{a:123, b:xyz}"
            },
        ];
    }
    
    _addGlobalListener() {
        super._addGlobalListener();
        app.system.addListener(app.commands.GET_PERSONAL_MESSAGES, this._onGetPersonalMessages, this);
    }

    _removeGlobalListener() {
        super._removeGlobalListener();
        app.system.removeListener(app.commands.GET_PERSONAL_MESSAGES, this._onGetPersonalMessages, this);
    }
    
    _requestMessagesList(page = 1) {
        app.service.send({
            cmd: app.commands.GET_PERSONAL_MESSAGES,
            data: {
                [app.keywords.PAGE_NEW]: page
            }
        });
    }
    
    _onGetPersonalMessages(data) {
        // console.debug('_onGetPersonalMessages', data);
    }
    
    createItemMessage(id, title, description, time, isNew) {
        if(this.itemPrefab) {
            let message = cc.instantiate(this.itemPrefab);
            let itemEventComponent = message.getComponent('ItemMessage');
            itemEventComponent && itemEventComponent.createItem(id, title, description, time, isNew);
            return message;
        }
    }
}

app.createComponent(TabPersonalMessages);