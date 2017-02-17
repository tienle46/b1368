import app from 'app';
import DialogActor from 'DialogActor';

class TopupDialog extends DialogActor {
    constructor() {
        super();
    }

    onLoad() {
        super.onLoad();
        // this._initComponents();
        this.node.on('touchstart', function() {
            return;
        });

        if (app.env.isMobile() && window.sdkbox.IAP) {

        }
    }

    onDestroy() {
        super.onDestroy();
        // this._removeGlobalListeners();
    }

    start() {
        super.start();
        this._sendTopUpList();
    }

    _addGlobalListener() {
        super._addGlobalListener();
        app.system.addListener(app.commands.USER_GET_CHARGE_LIST, this._onGetTopUpData, this);
    }

    _removeGlobalListener() {
        super._removeGlobalListener();
        app.system.removeListener(app.commands.USER_GET_CHARGE_LIST, this._onGetTopUpData, this);
    }

    _sendTopUpList() {
        let sendObject = {
            'cmd': app.commands.USER_GET_CHARGE_LIST,
            data: {
                carrierNames: [
                    // carrier name is here.
                ]
            }
        };

        app.service.send(sendObject);
    }

    _onGetTopUpData(data) {
        let dialogComponent = this.getDialog(this.node, true);

        if (dialogComponent) {
            dialogComponent.addSharedData('sms', data[app.keywords.CHARGE_SMS_OBJECT_IAC] || {});
            // if platform is IOS -> 'ap' || android -> 'bp'
            dialogComponent.addSharedData('iap', app.env.isAndroid() ? data[app.keywords.IN_BILLING_PURCHASE] : data[app.keywords.IN_APP_PURCHASE]);
        }
    }
}

app.createComponent(TopupDialog);