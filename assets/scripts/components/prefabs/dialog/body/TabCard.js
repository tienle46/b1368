import app from 'app';
import Component from 'Component';
import AlertPopupRub from 'AlertPopupRub';
import ToggleGroup from 'ToggleGroup';
import CheckBox from 'CheckBox';
import RubUtils from 'RubUtils';

class TabCard extends Component {
    constructor() {
        super();
    }

    onLoad() {
        // wait til every requests is done
        this.node.active = false;
        this._initCardsGroup();
    }

    _initCardsGroup() {
        let sendObject = {
            'cmd': app.commands.USER_GET_CHARGE_LIST
        };

        app.service.send(sendObject, (data) => {
            console.log(data);
            if (data) {
                let layoutComponent = cc.find('left/layout', this.node);
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

                // active node
                this.node.active = true;
            }
        }, app.const.scene.DASHBOARD_SCENE);
    }

    onHanleChargeBtnClick() {
        let centerComponent = this.node.getChildByName('center');
        let cardSerial = centerComponent.getChildByName('cardSerialEditBox').getComponent(cc.EditBox).string.trim();
        let serialNumber = centerComponent.getChildByName('serialNumberEditBox').getComponent(cc.EditBox).string.trim();

        console.log(isNaN(cardSerial), isNaN(serialNumber));
        if (cardSerial === "" || serialNumber === "" || isNaN(cardSerial) || isNaN(serialNumber)) {
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

app.createComponent(TabCard);