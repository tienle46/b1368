import app from 'app';
import Component from 'Component';
import ListItemBasicRub from 'ListItemBasicRub';
import RubUtils from 'RubUtils';
import LoaderRub from 'LoaderRub';

class TabTopVip extends Component {
    constructor() {
        super();

        this.flag = null;
        this.topNodeId = 14;
        this.currentPage = 1;
        
        this.contentNode = {
            default: null,
            type: cc.Node
        };
        this.top1Sprite = {
            default: null,
            type: cc.Sprite
        };

        this.top1Name = {
            default: null,
            type: cc.Label
        };
    }

    onLoad() {
        this.loader = new LoaderRub(this.node);
        // show loader
        this.loader.show();

        this._initData((data) => {
            this._initBody(data);
        });
        // this._initTabs();
    }

    _initData(cb) {
        let sendObject = {
            'cmd': app.commands.RANK_GROUP,
            'data': {
                [app.keywords.RANK_GROUP_TYPE]: app.const.DYNAMIC_GROUP_LEADER_BOARD,
                [app.keywords.RANK_ACTION_TYPE]: app.const.DYNAMIC_ACTION_BROWSE,
                [app.keywords.PAGE]: this.currentPage,
                [app.keywords.RANK_NODE_ID]: this.topNodeId,
            }
        };

        app.service.send(sendObject, (res) => {
            cb(res);
        });
    }

    _initBody(d) {
        const ul = d['unl'];

        if (ul.length > 0) {
            const topVipName = ul[0];

            this.top1Name.string = topVipName;

            // const top1Icon = `http://${app.config.host}:3767/img/xgameupload/images/avatar/${topVipName}`;
            // const top1Icon = 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Tamia_striatus_eating.jpg';
            // RubUtils.loadSpriteFrame(this.top1Sprite, top1Icon, cc.size(128, 128), true);
        }

        for (let i = 0; i < ul.length; i++) {
            let transactionItem = new ListItemBasicRub(`${i + 1}.`, { contentWidth: 60 });
            transactionItem.initChild();

            let label = {
                type: 'label',
                text: ul[i],
                size: {
                    width: 150,
                },
                fontColor: app.const.COLOR_WHITE,
                horizontalAlign: cc.Label.HorizontalAlign.LEFT,
                align: {
                    left: 20
                }
            };

            transactionItem.pushEl(label);

            const medalContainer = new cc.Node();
            const layoutComponent = medalContainer.addComponent(cc.Layout);
            layoutComponent.type = cc.Layout.Type.HORIZONTAL;
            layoutComponent.spacingX = 5;

            for (let j = 0; j < 5 - i; j++) {

                const medal = new cc.Node();
                const sprite = medal.addComponent(cc.Sprite);

                medalContainer.addChild(medal);

                RubUtils.loadSpriteFrame(sprite, `textures/medal_${j+1}`, cc.size(32, 34));
            }
            medalContainer.size = cc.Size(180, 60);
            medalContainer.position = cc.v2(190, 0);
            transactionItem.pushEl(medalContainer);

            this.contentNode.addChild(transactionItem.node());
        }
        this.loader.hide();
    }
}

app.createComponent(TabTopVip);