import app from 'app';
import Component from 'Component';
import GridViewRub from 'GridViewRub';
import numeral from 'numeral';
import RubUtils from 'RubUtils';

class TabTopCaoThu extends Component {
    constructor() {
        super();

        this.flag = null;
        this.topNodeId = 9;
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

        this.gamePicker = {
            default: null,
            type: cc.Node
        }
    }

    onLoad() {
        // wait til every requests is done
        // this.node.active = false;

        // get content node
        // this.contentNode = this.node.getChildByName('view').getChildByName('content');
        // this._initItemsList();
        // init tabRub
        this._initGameList();

        // this._initData().then((data) => {
        //     this._initBody(data);
        // });

    }

    _initGameList(){
        let sendObject = {
            'cmd': app.commands.RANK_GROUP,
            'data': {
                [app.keywords.RANK_GROUP_TYPE]: app.const.DYNAMIC_GROUP_LEADER_BOARD,
                [app.keywords.RANK_ACTION_TYPE]: app.const.DYNAMIC_ACTION_BROWSE,
                [app.keywords.PAGE]: this.currentPage,
                [app.keywords.RANK_NODE_ID]: 9,
            }
        };
        app.service.send(sendObject, (res) => {

            const node = new cc.Node();
            node.setContentSize(60,60);

            const button = node.addComponent(cc.Button);
            RubUtils.loadSpriteFrame(this.top1Sprite,
                'https://upload.wikimedia.org/wikipedia/commons/f/f7/Tamia_striatus_eating.jpg'
                , cc.size(60, 60), true, (spriteFrame) => {

            });

            this.gamePicker.addChild(node);
        });
    }

    _initData() {
        let sendObject = {
            'cmd': app.commands.RANK_GROUP,
            'data': {
                [app.keywords.RANK_GROUP_TYPE]: app.const.DYNAMIC_GROUP_LEADER_BOARD,
                [app.keywords.RANK_ACTION_TYPE]: app.const.DYNAMIC_ACTION_BROWSE,
                [app.keywords.PAGE]: this.currentPage,
                [app.keywords.RANK_NODE_ID]: 330,
            }
        };

        return new Promise((resolve, reject) => {
            app.service.send(sendObject, (res) => {
                log(res);


                if(res['unl'].length > 0){
                    const topVipName = res['unl'][0];

                    this.top1Name.string = topVipName;

                    // const top1Icon = `http://${app.config.host}:3767/img/xgameupload/images/avatar/${topVipName}`;
                    const top1Icon = 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Tamia_striatus_eating.jpg';
                    log(top1Icon);
                    RubUtils.loadSpriteFrame(this.top1Sprite, top1Icon, cc.size(128, 128), true, (spriteFrame) => {

                    });
                }

                const data = [
                    res['unl'].map((status, index)=>{
                        return `${index + 1}. `
                    }),
                    res['unl'],
                    res['ui1l'],
                    res['ui2l'],
                ];

                resolve(data);
            });
        });
    }

    _initBody(d) {

        let event = null;
        let body = this.contentNode;
        GridViewRub.show(body, {data: ['STT', 'Tài khoản', 'Thắng','Thua'], options : {fontColor: app.const.COLOR_YELLOW
            }}, d, { position: cc.v2(2, 120), width: 480, event,group: {widths:[80,200,100,100]} },
            ).then((rub) => {

        });
    }
}

app.createComponent(TabTopCaoThu);