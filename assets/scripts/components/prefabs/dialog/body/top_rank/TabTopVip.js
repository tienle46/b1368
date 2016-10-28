import app from 'app';
import Component from 'Component';
import GridViewRub from 'GridViewRub';
import RubUtils from 'RubUtils';

class TabTopVip extends Component {
    constructor() {
        super();
        this.GridViewCardTabRub = null;
        this.GridViewCardTabNode = null;
        this.flag = null;
        this.topNodeId = 14;
        this.currentPage = 1;
        this.bodyNode = {
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

                const data = [
                    res['unl'].map((status, index)=>{
                        return (index +  1) + '';
                    }),
                    res['unl'],
                    res['ui1l'],
                    res['ui2l'],
                ]

                if(res['unl'].length > 0){
                    const topVipName = res['unl'][0];

                    this.top1Name.string = topVipName;

                    const top1Icon = `http://${app.config.host}:3767/img/xgameupload/images/avatar/${topVipName}`;
                    log(top1Icon);
                    RubUtils.loadSpriteFrame(this.top1Sprite, top1Icon, cc.size(128, 128), true, (spriteFrame) => {

                    });
                }

                resolve(data);
            });
        });
    }

    _initBody(d) {

        GridViewRub.show(this.bodyNode, null, d, { position: cc.v2(2, 120), width: 600, group: {widths:[80,290,150,80]} }).then((rub) => {
            this.GridViewCardTabRub = rub;
            this.GridViewCardTabNode = this.GridViewCardTabRub._getNode();
        });
    }
}

app.createComponent(TabTopVip);