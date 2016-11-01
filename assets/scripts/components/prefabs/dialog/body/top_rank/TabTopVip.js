import app from 'app';
import Component from 'Component';
import ListItemBasicRub from 'ListItemBasicRub';
import RubUtils from 'RubUtils';

class TabTopVip extends Component {
    constructor() {
        super();
        this.GridViewCardTabRub = null;
        this.GridViewCardTabNode = null;
        this.flag = null;
        this.topNodeId = 14;
        this.currentPage = 1;
        this.contentNode = {
            default: null,
            type: cc.Node
        }
        this.top1Sprite = {
            default : null,
            type: cc.Sprite
        }

        this.top1Name = {
            default : null,
            type: cc.Label
        }
    }

    onLoad() {
        // wait til every requests is done
        // this.node.active = false;

        // get content node
        // this.contentNode = this.node.getChildByName('view').getChildByName('content');
        // this._initItemsList();
        // init tabRub
        this._initData().then((data) => {
            this._initBody(data);
        });
        // this._initTabs();
    }

    _initData() {
        let sendObject = {
            'cmd': app.commands.RANK_GROUP,
            'data': {
                [app.keywords.RANK_GROUP_TYPE]: app.const.DYNAMIC_GROUP_LEADER_BOARD,
                [app.keywords.RANK_ACTION_TYPE]: app.const.DYNAMIC_ACTION_BROWSE,
                [app.keywords.PAGE]: this.currentPage,
                [app.keywords.RANK_NODE_ID]: this.topNodeId,
            }
        };

        return new Promise((resolve, reject) => {
            app.service.send(sendObject, (res) => {
                log(res);

                resolve(res);
            });
        });
    }

    _initBody(d) {
        const ul = d['unl'];

        if(ul.length > 0){
            const topVipName = ul[0];

            this.top1Name.string = topVipName;

            // const top1Icon = `http://${app.config.host}:3767/img/xgameupload/images/avatar/${topVipName}`;
            const top1Icon = 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Tamia_striatus_eating.jpg';
            log(top1Icon);
            RubUtils.loadSpriteFrame(this.top1Sprite, top1Icon, cc.size(128, 128), true, (spriteFrame) => {

            });
        }

        for (let i = 0; i < ul.length; i++) {
            let transactionItem = new ListItemBasicRub(`<color=ffffff>${i + 1}.</color>`, {contentWidth: 60});
            transactionItem.initChild();

            let label = {
                type: 'label',
                text: ul[i],
                size: {
                    width: 150,
                },
                align: {
                    left: 20,
                    horizontalAlign: cc.Label.HorizontalAlign.LEFT,
                }
            };

            transactionItem.pushEl(label);

            const medalContainer = new cc.Node();
            const layoutComponent = medalContainer.addComponent(cc.Layout);
            layoutComponent.type = cc.Layout.Type.HORIZONTAL;
            layoutComponent.spacingX = 5;
            layoutComponent.padding = 5;

            for( let j = 0 ; j < 5 - i; j++){

                const medal = new cc.Node();
                const sprite = medal.addComponent(cc.Sprite);

                medalContainer.addChild(medal);

                RubUtils.loadSpriteFrame(sprite, `textures/medal_${j+1}`, cc.size(32, 34), false, (spriteFrame) => {

                });
            }
            medalContainer.setContentSize(200 , 60);

            medalContainer.position = cc.v2(150,0);
            transactionItem.pushEl(medalContainer);

            this.contentNode.addChild(transactionItem.node());
        }
    }
}

app.createComponent(TabTopVip);