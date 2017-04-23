import app from 'app';
import PopupTabBody from 'PopupTabBody';

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
        // TODO
        app.system.showLongToast('Chức năng đang cập nhật.................');
    }
}

app.createComponent(TabGiftCode);