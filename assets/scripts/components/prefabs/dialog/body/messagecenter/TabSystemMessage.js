/**
 * Created by trungnt on 10/14/16.
 */
import app from 'app';
import TabMessages from 'TabMessages';

class TabSystemMessage extends TabMessages {
    constructor() {
        super();
    }
    
    onLoad() {
        this.groupType = app.const.DYNAMIC_GROUP_NOTIFY;
        super.onLoad();
    }
    
    loadData() {
        super.start();
        let messages = [
            {
                title: 'Nhận được 5000.000 Chips từ người chơi',
                msg: 'Bạn nhận được <color=#a6b7c7>5000.000</color> từ người chơi abcdef. Ấn xyz để nhận xu nhé. Bạn nhận được <color=#a6b7c7>5000.000</color> từ người chơi abcdef. Ấn xyz để nhận xu nhé. Bạn nhận được <color=#a6b7c7>5000.000</color> từ người chơi abcdef. Ấn xyz để nhận xu nhé.',
                isNew: true
            },
            {
                title: 'Nhận được 5000.000 Chips từ người chơi',
                msg: 'Bạn nhận được <color=#a6b7c7>5000.000</color> từ người chơi abcdef. Ấn xyz để nhận xu nhé. Bạn nhận được <color=#a6b7c7>5000.000</color> từ người chơi abcdef. Ấn xyz để nhận xu nhé. Bạn nhận được <color=#a6b7c7>5000.000</color> từ người chơi abcdef. Ấn xyz để nhận xu nhé.',
                isNew: true
            },
            {
                title: 'Nhận được 5000.000 Chips từ người chơi',
                msg: 'Bạn nhận được <color=#a6b7c7>5000.000</color> từ người chơi abcdef. Ấn xyz để nhận xu nhé. Bạn nhận được <color=#a6b7c7>5000.000</color> từ người chơi abcdef. Ấn xyz để nhận xu nhé. Bạn nhận được <color=#a6b7c7>5000.000</color> từ người chơi abcdef. Ấn xyz để nhận xu nhé.',
                isNew: true
            },
            {
                title: 'Nhận được 5000.000 Chips từ người chơi',
                msg: 'Bạn nhận được <color=#a6b7c7>5000.000</color> từ người chơi abcdef. Ấn xyz để nhận xu nhé. Bạn nhận được <color=#a6b7c7>5000.000</color> từ người chơi abcdef. Ấn xyz để nhận xu nhé. Bạn nhận được <color=#a6b7c7>5000.000</color> từ người chơi abcdef. Ấn xyz để nhận xu nhé.',
                isNew: true
            },
            {
                title: 'Nhận được 5000.000 Chips từ người chơi',
                msg: 'Bạn nhận được <color=#a6b7c7>5000.000</color> từ người chơi abcdef. Ấn xyz để nhận xu nhé. Bạn nhận được <color=#a6b7c7>5000.000</color> từ người chơi abcdef. Ấn xyz để nhận xu nhé. Bạn nhận được <color=#a6b7c7>5000.000</color> từ người chơi abcdef. Ấn xyz để nhận xu nhé.',
                isNew: true
            },
            {
                title: 'Nhận được 5000.000 Chips từ người chơi',
                msg: 'Bạn nhận được <color=#a6b7c7>5000.000</color> từ người chơi abcdef. Ấn xyz để nhận xu nhé. Bạn nhận được <color=#a6b7c7>5000.000</color> từ người chơi abcdef. Ấn xyz để nhận xu nhé. Bạn nhận được <color=#a6b7c7>5000.000</color> từ người chơi abcdef. Ấn xyz để nhận xu nhé.',
                isNew: true
            },
        ];
        this.displayMessages(messages.map(message => {
            let {title, msg, time, isNew} = message;
            return this.createItemMessage(null, title, msg, time, isNew);
        }));
        return false;
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
        app.service.send({
            cmd: app.commands.GET_SYSTEM_MESSAGES,
            data: {
                [app.keywords.PAGE_NEW]: page
            }
        });
    }
    
    _onGetSystemMessages(data) {
        let {messages, page} = data;
        messages = [
            {
                title: 'Nhận được 5000.000 Chips từ người chơi',
                msg: 'Bạn nhận được <color=#a6b7c7>5000.000</color> từ người chơi abcdef. Ấn xyz để nhận xu nhé. Bạn nhận được <color=#a6b7c7>5000.000</color> từ người chơi abcdef. Ấn xyz để nhận xu nhé. Bạn nhận được <color=#a6b7c7>5000.000</color> từ người chơi abcdef. Ấn xyz để nhận xu nhé.',
                isNew: true
            },
            {
                title: 'Nhận được 5000.000 Chips từ người chơi',
                msg: 'Bạn nhận được <color=#a6b7c7>5000.000</color> từ người chơi abcdef. Ấn xyz để nhận xu nhé. Bạn nhận được <color=#a6b7c7>5000.000</color> từ người chơi abcdef. Ấn xyz để nhận xu nhé. Bạn nhận được <color=#a6b7c7>5000.000</color> từ người chơi abcdef. Ấn xyz để nhận xu nhé.',
                isNew: true
            },
            {
                title: 'Nhận được 5000.000 Chips từ người chơi',
                msg: 'Bạn nhận được <color=#a6b7c7>5000.000</color> từ người chơi abcdef. Ấn xyz để nhận xu nhé. Bạn nhận được <color=#a6b7c7>5000.000</color> từ người chơi abcdef. Ấn xyz để nhận xu nhé. Bạn nhận được <color=#a6b7c7>5000.000</color> từ người chơi abcdef. Ấn xyz để nhận xu nhé.',
                isNew: true
            },
            {
                title: 'Nhận được 5000.000 Chips từ người chơi',
                msg: 'Bạn nhận được <color=#a6b7c7>5000.000</color> từ người chơi abcdef. Ấn xyz để nhận xu nhé. Bạn nhận được <color=#a6b7c7>5000.000</color> từ người chơi abcdef. Ấn xyz để nhận xu nhé. Bạn nhận được <color=#a6b7c7>5000.000</color> từ người chơi abcdef. Ấn xyz để nhận xu nhé.',
                isNew: true
            },
            {
                title: 'Nhận được 5000.000 Chips từ người chơi',
                msg: 'Bạn nhận được <color=#a6b7c7>5000.000</color> từ người chơi abcdef. Ấn xyz để nhận xu nhé. Bạn nhận được <color=#a6b7c7>5000.000</color> từ người chơi abcdef. Ấn xyz để nhận xu nhé. Bạn nhận được <color=#a6b7c7>5000.000</color> từ người chơi abcdef. Ấn xyz để nhận xu nhé.',
                isNew: true
            },
            {
                title: 'Nhận được 5000.000 Chips từ người chơi',
                msg: 'Bạn nhận được <color=#a6b7c7>5000.000</color> từ người chơi abcdef. Ấn xyz để nhận xu nhé. Bạn nhận được <color=#a6b7c7>5000.000</color> từ người chơi abcdef. Ấn xyz để nhận xu nhé. Bạn nhận được <color=#a6b7c7>5000.000</color> từ người chơi abcdef. Ấn xyz để nhận xu nhé.',
                isNew: true
            },
        ];
        if(messages.length > 0) {
            this.displayMessages(messages.map(message => {
                let {title, msg, time, isNew} = message;
                
                return this.createItemMessage(null, title, msg, time, isNew);
            }));
        }else {
            this.pageIsEmpty(this.node);
        }
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

app.createComponent(TabSystemMessage);