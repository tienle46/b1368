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
            log('IAP: ----> Topup:', cc.sys.localStorage.getItem(app.const.IAP_LOCAL_STORAGE));
        }
    }

    onDestroy() {
        super.onDestroy();
        // this._removeGlobalListeners();
    }

    start() {
        super.start();
    }

    _addGlobalListener() {
        super._addGlobalListener();
    }

    _removeGlobalListener() {
        super._removeGlobalListener();
    }

    // _onGetTopUpData(data) {
    //     let dialogComponent = this.getDialog(this.node, true);

    //     if (dialogComponent) {
    //         dialogComponent.addSharedData('sms', data[app.keywords.CHARGE_SMS_OBJECT_IAC] || {});
    //         // if platform is IOS -> 'ap' || android -> 'bp'
    //         dialogComponent.addSharedData('iap', app.env.isAndroid() ? data[app.keywords.IN_BILLING_PURCHASE] : data[app.keywords.IN_APP_PURCHASE]);
    //     }
    // }
}

app.createComponent(TopupDialog);