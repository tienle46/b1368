var app = require('app');
var Component = require('Component');
var ToggleGroup = require('ToggleGroup');
import CheckBox from 'CheckBox';
import AlertPopupRub from 'AlertPopupRub';

class TopupDialog extends Component {
    constructor() {
        super();
    }

    onLoad() {
        this._initComponents();
    }

    _initComponents() {
        this._initCardsGroup();
    }

    _initCardsGroup() {
        let sendObject = {
            'cmd': app.commands.USER_GET_CHARGE_LIST
        };

        app.service.send(sendObject, (data) => {
            console.log(data);
            if (data) {
                let layoutComponent = cc.find('dialog/tab_card/left/layout', this.node);
                this.toggleGroup = layoutComponent.getComponent(ToggleGroup);
                data['il'].forEach((id, index) => {
                    //load prefab
                    cc.loader.loadRes('dashboard/topup/cardItem', (err, prefab) => {
                        if (err) {
                            console.log("error", err);
                            return;
                        }
                        let cardPrefab = cc.instantiate(prefab);
                        // load frame 
                        cc.loader.loadRes(`dashboard/popup-card-${data['nl'][index].toLowerCase()}`, cc.SpriteFrame, (err, spriteFrame) => {
                            if (err) {
                                console.log("err", err);
                            }
                            cardPrefab.children[0].getComponent(cc.Sprite).spriteFrame = spriteFrame;

                            let card = cardPrefab.getComponent(CheckBox);
                            card.setVal(id);
                            card.isChecked = index === 0;

                            // get left/layout
                            layoutComponent.addChild(cardPrefab);
                            // push card checkbox to toggleGroup
                            this.toggleGroup.addItem(card);
                            //reset state
                            index === 0 && this.toggleGroup.onLoad();
                        });
                    });
                });
            }
        }, app.const.scene.DASHBOARD_SCENE);
    }

    onHanleChargeBtnClick() {
        let centerComponent = cc.find('dialog/tab_card/center', this.node);
        let cardSerial = cc.find('cardSerialEditBox', centerComponent).getComponent(cc.EditBox).string.trim();
        let serialNumber = cc.find('serialNumberEditBox', centerComponent).getComponent(cc.EditBox).string.trim();

        console.log(isNaN(cardSerial), isNaN(serialNumber));
        if (cardSerial === "" || serialNumber === "" || isNaN(cardSerial) || isNaN(serialNumber)) {
            // var msgDialog = xg.OutGameMessageDialog.create("Vui lòng nhập đầy đủ thông tin", xg.FRAMENAME_OUTGAME_CONFIML_DIALOG_BG, new cc.Color(1, 1, 1), null, 0);
            // msgDialog.show();
            // load prefab
            AlertPopupRub.show(this.node, 'Vui lòng nhập đầy đủ thông tin');
        } else {
            let id = this.toggleGroup.getVal();

            let data = {};
            data[app.keywords.CHARGE_CARD_PROVIDER_ID] = id;
            data[app.keywords.CARD_CODE] = cardSerial;
            data[app.keywords.CARD_SERIAL] = serialNumber;
            let sendObject = {
                'cmd': app.commands.USER_SEND_CARD_CHARGE,
                data
            };
            console.log(sendObject);
            app.service.send(sendObject, (data) => {
                console.log(data);
                if (data) {
                    let layoutComponent = cc.find('dialog/tab_card/left/layout', this.node);
                    this.toggleGroup = layoutComponent.getComponent(ToggleGroup);
                    data['il'].forEach((id, index) => {
                        //load prefab
                        cc.loader.loadRes('dashboard/topup/cardItem', (err, prefab) => {
                            if (err) {
                                console.log("error", err);
                                return;
                            }
                            let cardPrefab = cc.instantiate(prefab);
                            // load frame 
                            cc.loader.loadRes(`dashboard/popup-card-${data['nl'][index].toLowerCase()}`, cc.SpriteFrame, (err, spriteFrame) => {
                                if (err) {
                                    console.log("err", err);
                                }
                                cardPrefab.children[0].getComponent(cc.Sprite).spriteFrame = spriteFrame;

                                let card = cardPrefab.getComponent(CheckBox);
                                card.setVal(id);
                                card.isChecked = index === 0;

                                // get left/layout
                                layoutComponent.addChild(cardPrefab);
                                // push card checkbox to toggleGroup
                                this.toggleGroup.addItem(card);
                                //reset state
                                index === 0 && this.toggleGroup.onLoad();
                            });
                        });
                    });
                }
            }, app.const.scene.DASHBOARD_SCENE);
        }
    }
}

app.createComponent(TopupDialog);