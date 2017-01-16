import app from 'app';
import Actor from 'Actor';
import RubUtils from 'RubUtils';

class TabTopCaoThu extends Actor {
    constructor() {
        super();

        this.properties = {
            ...this.properties,
            gamePicker: cc.Node,
            contentNode: cc.Node,
            crownsNode: cc.Node,
            gameItem: cc.Node,
            backGroundSprite: cc.Sprite
        }

        this.currentNodeId = null;
        this.itemLoaded = null;
        this.currentPage = 1;
    }

    start() {
        super.start();
        let topNodeId = 9; // use for requesting game icons list
        this._requestDataFromServer(topNodeId, this.currentPage);
    }

    _addGlobalListener() {
        super._addGlobalListener();
        app.system.addListener(app.commands.RANK_GROUP, this._onReceivedData, this);
    }

    _removeGlobalListener() {
        super._removeGlobalListener();
        app.system.removeListener(app.commands.RANK_GROUP, this._onReceivedData, this);
    }

    _requestDataFromServer(nodeId, page) {
        this.currentNodeId = nodeId;

        let sendObject = {
            'cmd': app.commands.RANK_GROUP,
            'data': {
                [app.keywords.RANK_GROUP_TYPE]: app.const.DYNAMIC_GROUP_LEADER_BOARD,
                [app.keywords.RANK_ACTION_TYPE]: app.const.DYNAMIC_ACTION_BROWSE,
                [app.keywords.PAGE]: page,
                [app.keywords.RANK_NODE_ID]: nodeId,
            }
        };

        app.system.showLoader();
        app.service.send(sendObject);
    }

    _onReceivedData(res) {
        if (!this.itemLoaded) {
            if (res[app.keywords.RANK_TYPE_ID] && res[app.keywords.RANK_TYPE_ID].length > 0) {
                this.gameList = res;

                let dNodeIds = this.gameList[app.keywords.RANK_TYPE_ID];
                let gameImages = this.gameList[app.keywords.RANK_TYPE_ICON];

                let count = 0;
                app.async.mapSeries(gameImages, (imgName, cb) => {
                    // RubUtils.loadSpriteFrame(nodeSprite, app.res.gameTopCapThuIcon[imgName], cc.size(100, 100));
                    let gameIconPath = app.res.gameTopCapThuIcon[imgName];
                    gameIconPath && RubUtils.getSpriteFrameFromAtlas('blueTheme/atlas/game_icons', gameIconPath, (sprite) => {
                        this.backGroundSprite.spriteFrame = sprite;
                        let node = cc.instantiate(this.gameItem);
                        let toggle = node.getComponent(cc.Toggle);
                        toggle.isChecked = count === 0;
                        node.dNodeId = dNodeIds[count];

                        if (toggle.isChecked) {
                            this.itemLoaded = true;
                            this._requestDataFromServer(node.dNodeId, 1);
                        }
                        node.active = true;

                        this.gamePicker.addChild(node);

                        count++;

                        cb();
                    });
                });
            }
        } else {
            let data = [
                res[app.keywords.USERNAME_LIST].map((status, index) => {
                    let p = res['p'] || 1;
                    let order = (index + 1) + (p - 1) * 20;
                    if (this.crownsNode.children[index] && order <= 3)
                        return cc.instantiate(this.crownsNode.children[index]);
                    else
                        return `${order}.`;
                }),
                res[app.keywords.USERNAME_LIST],
                res['ui1l'],
            ];

            this._initBody(data);
            data = null;
        }
        res = null;
    }

    onGameItemClicked(event) {
        let dNodeId = event.node.dNodeId;
        this.currentNodeId = dNodeId;
        this._requestDataFromServer(this.currentNodeId, 1);
    }

    _initBody(d) {
        this.contentNode.children && this.contentNode.children.map(child => cc.isValid(child) && child.destroy() && child.removeFromParent());

        let next = this.onNextBtnClick.bind(this);
        let prev = this.onPreviousBtnClick.bind(this);

        this.initGridView({
            data: ['STT', 'Tài khoản', 'Thắng'],
            options: {
                fontColor: app.const.COLOR_YELLOW
            }
        }, d, {
            paging: { next, prev },
            position: cc.v2(0, 10),
            width: 670,
            height: 390,
            event,
            group: {
                widths: [80, 350, ''],
                colors: ['', '', new cc.Color(255, 214, 0)]
            }
        });
        this.contentNode.addChild(this.getGridViewNode());
        d = null;
        app.system.hideLoader();
    }

    onPreviousBtnClick() {
        this.currentPage -= 1;
        if (this.currentPage < 1) {
            this.currentPage = 1;
            return null;
        }
        this._requestDataFromServer(this.currentNodeId, this.currentPage);
    }

    onNextBtnClick() {
        this.currentPage += 1;
        this._requestDataFromServer(this.currentNodeId, this.currentPage);
    }
}

app.createComponent(TabTopCaoThu);