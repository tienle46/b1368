import app from 'app';
import Actor from 'Actor';
import numeral from 'numeral';

class TabSMS extends Actor {
    constructor() {
        super();
        this.properties = {
            ...this.properties,
            toggleGroupNode: cc.Node,
            itemNode: cc.Node,
            h1Lbl: cc.Label,
            sendToLbl: cc.Label,
            commandLbl: cc.Label,
            moneyGetLbl: cc.Label,
        };
    }

    onLoad() {
        this.node.active = true;

        let data = {
            ap: ['com.bamienstudio.baibamien.4000g', 'com.bamienstudio.baibamien.8000g'],
            bp: {
                dl: ['4000 Gold (1AU -> 4000Xu)', 'Test (0AU -> 1Xu)'],
                il: ['com.milabs.4000', 'android.test.purchased']
            },
            c: {

            },
            il: [],
            nl: [],
            s: {
                b: [30000,
                    50000,
                    120000,
                    200000,
                    350000,
                    750000,
                    120000,
                    200000,
                    350000,
                    120000,
                    200000,
                    350000
                ],
                s: [8698,
                    8798,
                    9029,
                    9029,
                    9029,
                    9029,
                    9029,
                    9029,
                    9029,
                    9029,
                    9029,
                    9029
                ],
                c: ["DR 1 bitcoin",
                    "DR 1 bitcoin",
                    "MW 20000 VLA NAP 1/bitcoin",
                    "MW 30000 VLA NAP 1/bitcoin",
                    "MW 50000 VLA NAP 1/bitcoin",
                    "MW 100000 VLA NAP 1/bitcoin",
                    "MW VLA NAP20 1/bitcoin",
                    "MW VLA NAP30 1/bitcoin",
                    "MW VLA NAP50 1/bitcoin",
                    "MW VLA NAP20 1/bitcoin",
                    "MW VLA NAP30 1/bitcoin",
                    "MW VLA NAP50 1/bitcoin"
                ],
                m: ["10000 VN\U0110",
                    "15000 VN\U0110",
                    "Viettel  20K",
                    "Viettel  30K",
                    "Viettel  50K",
                    "Viettel  100K",
                    "Mobi  20K",
                    "Mobi  30K",
                    "Mobi  50K",
                    "Vina  20K",
                    "Vina  30K",
                    "Vina  50K"
                ]
            }
        }

        this._onUserGetChargeList(data);
    }

    start() {
        super.start();
        // this._requestPaymentList();
    }

    onItemBtnClick() {

    }

    _addGlobalListener() {
        super._addGlobalListener();
        app.system.addListener(app.commands.USER_GET_CHARGE_LIST, this._onUserGetChargeList, this);
    }

    _removeGlobalListener() {
        super._removeGlobalListener();
        app.system.removeListener(app.commands.USER_GET_CHARGE_LIST, this._onUserGetChargeList, this);
    }

    _requestPaymentList() {
        var sendObject = {
            'cmd': app.commands.USER_GET_CHARGE_LIST,
        };

        app.service.send(sendObject);
    }

    _onUserGetChargeList(data) {
        // app.keywords.CHARGE_SMS_OBJECT
        if (data.hasOwnProperty(app.keywords.CHARGE_SMS_OBJECT)) {
            const obj = data[app.keywords.CHARGE_SMS_OBJECT];
            if (obj.hasOwnProperty(app.keywords.CHARGE_SMS_MONEY_GOT) && obj.hasOwnProperty(app.keywords.CHARGE_SMS_MONEY_LOST) &&
                obj.hasOwnProperty(app.keywords.CHARGE_SMS_SHORT_CODE) &&
                obj.hasOwnProperty(app.keywords.CHARGE_SMS_COMMAND)
            ) {
                let moneyGotList = obj[app.keywords.CHARGE_SMS_MONEY_GOT];
                let moneySpendList = obj[app.keywords.CHARGE_SMS_MONEY_LOST];
                let sendToList = obj[app.keywords.CHARGE_SMS_SHORT_CODE];
                let commandList = obj[app.keywords.CHARGE_SMS_COMMAND];

                for (let i = 0; i < moneyGotList.length; i++) {
                    let smsModel = {};
                    smsModel['moneyGot'] = moneyGotList[i];
                    smsModel['moneyLost'] = moneySpendList[i];
                    smsModel['sendTo'] = sendToList[i];
                    smsModel['command'] = commandList[i];
                    smsModel['isChecked'] = i === 0;

                    this._initItem(smsModel);
                }
            }
        }

        //TODO: what the hell is ac
        if (data.hasOwnProperty('ac')) {
            let smsObj = data['ac'];

        }
    }

    _initItem({ command, sendTo, moneyGot, isChecked }) {
        let cmdArray = command.split(' ');
        let h1 = cmdArray.shift();
        let cmd = cmdArray.join(' ');

        this.h1Lbl.string = h1;
        this.commandLbl.string = cmd;
        this.sendToLbl.string = `Gửi ${sendTo}`;
        this.moneyGetLbl.string = `${numeral(moneyGot).format('0,0')}`;

        let item = cc.instantiate(this.itemNode);
        item.active = true;
        let toggle = item.getComponent(cc.Toggle);
        toggle.isChecked = isChecked;

        this.toggleGroupNode.addChild(item);
    }
}

app.createComponent(TabSMS);