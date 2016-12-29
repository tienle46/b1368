import app from 'app';
import Component from 'Component';
import AlertPopupRub from 'AlertPopupRub';
import RubUtils from 'RubUtils';
import ConfirmPopupRub from 'ConfirmPopupRub';
import ExchangeDialog from 'ExchangeDialog';
import numeral from 'numeral';

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
        // wait til every requests is done
        this.node.active = true;

        this.messageLabel.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
        this.messageLabel.overflow = cc.Label.Overflow.RESIZE_HEIGHT;
        this.messageLabel.enableWrapText = true;
        let userName = app.context.getMyInfo().name;
        this.messageLabel.string = `Bạn đang sử dụng tài khoản "${userName}" để nhận thưởng`;
        // this.messageLabel.string = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Hanc quoque iucunditatem, si vis, transfer in animum; Est enim tanti philosophi tamque nobilis audacter sua decreta defendere';
        //trungnt: customize font is not available yet

        this.messageLabel.isSystemFontUsed = false;
        RubUtils.loadRes('fonts/newFonts/ICIELPANTON-BLACK').then((font) => {
            this.messageLabel.font = font;
            this.messageLabel.fontSize = 28;
        })

        this.giftCodeInput.placeholder = 'Nhập mã code';
        // get content node

        // this.contentNode = this.node.getChildByName('view').getChildByName('content');
        // this._getExchangeDialogComponent().hideUpdatePhone();
        //
        // let event = new cc.Component.EventHandler();
        // event.target = this.node;
        // event.component = 'TabExchangeCard';
        // event.handler = 'scrollEvent';
        //
        // this.node.getComponent(cc.ScrollView).scrollEvents.push(event);
    }
    onHandleExchangeBtnClick(event) {
        let itemGold = event.currentTarget.itemGold;
        let itemName = event.currentTarget.itemName;

        let parentNode = this.node.parent.parent;

        ConfirmPopupRub.show(parentNode, `Bạn có muốn đổi ${numeral(itemGold).format('0,0')} chip để nhận ${itemName} ?`, this._onConfirmDialogBtnClick, null, this);
    }

    _onConfirmDialogBtnClick() {
        let itemGold = event.currentTarget.itemGold;
        let itemName = event.currentTarget.itemName;

        let parentNode = this.node.parent.parent;

        if (app.context.needUpdatePhoneNumber()) {
            // hide this node
            this._hide();
            // show update_phone_number
            this._getExchangeDialogComponent().showUpdatePhone();
        } else {
            // TODO
            // if user gold less than itemGold -> show AlertPopupRub
            let myCoin = app.context.getMyInfo().coin;
            console.log(myCoin);
            if (Number(myCoin) < Number(itemGold)) {
                AlertPopupRub.show(parentNode, `Số tiền hiện tại ${numeral(myCoin).format('0,0')} không đủ để đổi vật phẩm ${itemName}`);
                return;
            }
            // else send request
            let id = event.currentTarget.itemId;

            let data = {};
            data[app.keywords.EXCHANGE.REQUEST.ID] = id;
            let sendObject = {
                'cmd': app.commands.EXCHANGE,
                data
            };
            log(sendObject);
            app.service.send(sendObject, (data) => {
                log(data);
            });
        }
    }
    _initRowNode() {
        let rowNode = new cc.Node();
        rowNode.width = 780;
        rowNode.height = 124;
        rowNode.name = 'container';
        return rowNode;
    }

    _getExchangeDialogComponent() {
        // this node -> body -> dialog -> dialog (parent)
        let dialogNode = this.node.parent.parent.parent;
        console.log(dialogNode.getComponent(ExchangeDialog));

        return dialogNode.getComponent(ExchangeDialog);
    }

    _getUpdatePhoneNode() {
        return this._getExchangeDialogComponent().updatePhoneNode();
    }

    _hide() {
        this.node.active = false;
    }

    scrollEvent(sender, event) {
        switch (event) {
            case 0:
                console.log('Scroll to Top');
                break;
            case 1:
                console.log('Scroll to Bottom');
                break;
            case 2:
                console.log('Scroll to left');
                break;
            case 3:
                console.log('Scroll to right');
                break;
            case 4:
                console.log('Scrolling');
                break;
            case 5:
                console.log('Bounce Top');
                break;
            case 6:
                console.log('Bounce bottom');
                break;
            case 7:
                console.log('Bounce left');
                break;
            case 8:
                console.log('Bounce right');
                break;
            case 9:
                console.log('Auto scroll ended');
                break;
        }
    }
}

app.createComponent(TabGiftCode);