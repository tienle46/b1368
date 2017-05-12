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
        this.showLoadingProgress();
    }
    
    _addGlobalListener() {
        super._addGlobalListener();
        app.system.addListener(app.commands.GIFT_CODE, this._onGetGiftCode, this);
    }

    _removeGlobalListener() {
        super._removeGlobalListener();
        app.system.removeListener(app.commands.GIFT_CODE, this._onGetGiftCode, this);
    }
    
    _isValidInput(code, allowedLength = 8) {
        if(Utils.isEmpty(code))
            return;
        
        return code.trim().length >= allowedLength && new RegExp(`[a-zA-Z0-9]{${allowedLength},10}`).test(code) && !/\s/.test(code);
    }
    
    _onGetGiftCode(data) {
        this.hideLoadingProgress();
        if(data[app.keywords.RESPONSE_RESULT]) {
            app.system.info(data[app.keywords.RESPONSE_MESSAGE]);
            this.giftCodeInput.string = "";
        } else {
            app.system.error(data[app.keywords.RESPONSE_MESSAGE] || app.res.string('error_unknow'));
        }
    }
}

app.createComponent(TabGiftCode);