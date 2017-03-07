import app from 'app';
import Component from 'Component';

class TabGiftCode extends Component {
    constructor() {
        super()
        this.messageLabel = {
            default: null,
            type: cc.Label
        }
        this.giftCodeInput = {
            default: null,
            type: cc.EditBox
        }
    }

    onLoad() {
        super.onLoad();

        // wait til every requests is done
        this.node.active = true;
        this.messageLabel.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
        this.messageLabel.overflow = cc.Label.Overflow.RESIZE_HEIGHT;
        this.messageLabel.enableWrapText = true
    }

    onEnable(){
        super.onEnable();

        let userName = app.context.getMyInfo().name;
        this.messageLabel.string = `Bạn đang sử dụng tài khoản "${userName}" để nhận thưởng`;

        this.giftCodeInput.placeholder = 'Nhập mã code';
    }
}

app.createComponent(TabGiftCode);