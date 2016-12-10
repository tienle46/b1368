import app from 'app';
// import Component from 'Component';
// import ToggleGroup from 'ToggleGroup';
// import CheckBox from 'CheckBox';
import AlertPopupRub from 'AlertPopupRub';
import Dialog from 'Dialog';
import SFS2X from 'SFS2X';

class TopupDialog extends Dialog {
    constructor() {
        super();
    }

    onLoad() {
        // this._initComponents();
        this.node.on('touchstart', function() {
            return;
        });
    }

    _addGlobalListeners() {
        app.service.addEventListener(SFS2X.SFSEvent.EXTENSION_RESPONSE, this._onExtensionResponse, this);
    }

    _removeGlobalListeners() {
        app.service.removeEventListener(SFS2X.SFSEvent.EXTENSION_RESPONSE, this._onExtensionResponse, this);
    }

    onEnable() {
        debug('onEnable');
        this._addGlobalListeners();
    }

    onDestroy() {
        debug('onDestroy');
        this._removeGlobalListeners();
    }

    _onExtensionResponse(event) {
        // console.debug('_onExtensionResponse', event);
        if (event[app.keywords.BASE_EVENT_CMD] === app.commands.SYSTEM_MESSAGE) {
            let params = event[app.keywords.BASE_EVENT_PARAMS];
            let messageList = params[app.keywords.MESSAGE_LIST];
            messageList && messageList.length > 0 && AlertPopupRub.show(null, `${messageList[0]}`);
        }
    }
}

app.createComponent(TopupDialog);