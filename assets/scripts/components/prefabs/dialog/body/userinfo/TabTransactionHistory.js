import app from 'app';
import Component from 'Component';
import RubUtils from 'RubUtils';
import ListItem from 'ListItem';

class TabTransactionHistory extends Component {
    constructor() {
        super()
        this.contentNode = {
            default: null,
            type: cc.Node
        }
    }

    onLoad() {
        // this.node.getComponent(cc.ScrollView).scrollEvents.push(event);
        let data = {
            p: 1
        };
        let sendObj = {
            cmd: "b_ath",
            data
        };

        app.service.send(sendObj, (data) => {
            console.log(data);
            RubUtils.loadRes('dashboard/dialog/prefabs/userinfo/list_item').then((preFab) => {
                for (let i = 0; i < data.gold.length; i++) {
                    const transactionItem = cc.instantiate(preFab);
                    transactionItem.getComponent('ListItem').initWithStyle(ListItem.TYPE.STYLE1, true);
                    const widget = transactionItem.addComponent(cc.Widget);
                    widget.isAlignLeft = true;
                    widget.isAlignRight = true;

                    widget.left = 0;
                    widget.right = 0;

                    this.contentNode.addChild(transactionItem);
                }
            });
        });
    }


    _hide() {
        this.node.active = false;
    }
}

app.createComponent(TabTransactionHistory);