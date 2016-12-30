import app from 'app';
import Component from 'Component';
import GridViewRub from 'GridViewRub';
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
        };

        this.gamePicker = {
            default: null,
            type: cc.Node
        };

    }

    onLoad() {

        this._initGameList();

    }

    _initGameList() {
        let sendObject = {
            'cmd': app.commands.RANK_GROUP,
            'data': {
                [app.keywords.RANK_GROUP_TYPE]: app.const.DYNAMIC_GROUP_LEADER_BOARD,
                [app.keywords.RANK_ACTION_TYPE]: app.const.DYNAMIC_ACTION_BROWSE,
                [app.keywords.PAGE]: this.currentPage,
                [app.keywords.RANK_NODE_ID]: 9,
            }
        };
        app.system.showLoader();
        app.service.send(sendObject, (res) => {
            if (res['itl'] && res['itl'].length > 0) {
                this.gameList = res;

                let dNodeIds = this.gameList['itl'];
                let gameImages = this.gameList['iml'];

                gameImages.forEach((imgName, index) => {
                    const node = new cc.Node();

                    node.dNodeId = dNodeIds[index];

                    const button = node.addComponent(cc.Button);
                    const nodeSprite = node.addComponent(cc.Sprite);
                    debug(imgName, app.res.gameTopCapThuIcon[imgName]);
                    RubUtils.loadSpriteFrame(nodeSprite,
                        app.res.gameTopCapThuIcon[imgName], cc.size(100, 100), false, (spriteFrame) => {
                            log(`image loaded`);
                        });

                    let event = new cc.Component.EventHandler();
                    event.target = this.node;
                    event.component = 'TabTopCaoThu';
                    event.handler = 'onGameItemClicked';
                    button.clickEvents = [event];

                    this.gamePicker.addChild(node);
                });

                // last call
                setTimeout(() => {
                    this._showTopPlayers(dNodeIds[0], (data) => {
                        this._initBody(data);
                    });
                });
            }

        });
    }

    onGameItemClicked(event) {
        let dNodeId = event.currentTarget.dNodeId;

        this._showTopPlayers(dNodeId, (data) => {
            this._initBody(data);
        });
    }

    _showTopPlayers(dNodeId, cb) {
        app.system.showLoader();
        let sendObject = {
            'cmd': app.commands.RANK_GROUP,
            'data': {
                [app.keywords.RANK_GROUP_TYPE]: app.const.DYNAMIC_GROUP_LEADER_BOARD,
                [app.keywords.RANK_ACTION_TYPE]: app.const.DYNAMIC_ACTION_BROWSE,
                [app.keywords.PAGE]: this.currentPage,
                [app.keywords.RANK_NODE_ID]: dNodeId,
            }
        };
        app.service.send(sendObject, (res) => {
            const data = [
                res['unl'].map((status, index) => {
                    return `${index + 1}. `;
                }),
                res['unl'],
                res['ui1l'],
                res['ui2l'],
            ];

            cb(data);
        });
    }

    _initBody(d) {
        let event = null;
        let body = this.contentNode;
        body.removeAllChildren();

        app.system.hideLoader();

        GridViewRub.show(body, {
            data: ['STT', 'Tài khoản', 'Thắng', 'Thua'],
            options: {
                fontColor: app.const.COLOR_YELLOW
            }
        }, d, {
            paging: {},
            position: cc.v2(0, 10),
            width: 670,
            height: 390,
            event,
            group: {
                widths: [80, 350, '', '']
            }
        });
    }
}

app.createComponent(TabTopCaoThu);