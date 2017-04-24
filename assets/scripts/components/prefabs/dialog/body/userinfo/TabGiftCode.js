import app from 'app';
import PopupTabBody from 'PopupTabBody';
import Utils from 'Utils';

class TabGiftCode extends PopupTabBody {
    constructor() {
        super();
        this.giftCodeInput = {
            default: null,
            type: cc.EditBox
        }
    }

    onLoad() {
        super.onLoad();
    }

    onEnable(){
        super.onEnable();
    }
    
    onConfirmBtnClick() {
        let input = this.giftCodeInput.string.trim();
        
        if(!this._isValidInput(input)) {
            app.system.error(app.res.string('error_gift_code_is_invalid'));
            return;
        }
            
        app.service.send({
            cmd: app.commands.GIFT_CODE,
            data: {
                'giftCode': input
            }
        });
    }
    
    _addGlobalListener() {
        super._addGlobalListener();
        app.system.addListener(app.commands.GIFT_CODE, this._onGetGiftCode, this);
    }

    _removeGlobalListener() {
        super._removeGlobalListener();
        app.system.removeListener(app.commands.GIFT_CODE, this._onGetGiftCode, this);
    }
    
    _isValidInput(code, allowedLength = 6) {
        if(Utils.isEmpty(code))
            return;
        
        return code.length == allowedLength && /[a-zA-Z0-9]{5,}/.test(code) && /[a-zA-Z]/.test(code) && /[0-9]/.test(code) && !/\s/.test(code);
    }
    
    _onGetGiftCode(data) {
        if(data[app.keywords.RESPONSE_RESULT]) {
            app.system.showLongToast(data[app.keywords.RESPONSE_MESSAGE]);
        } else {
            app.system.error(data[app.keywords.RESPONSE_MESSAGE] || app.res.string('error_unknow'));
        }
    }
}

app.createComponent(TabGiftCode);