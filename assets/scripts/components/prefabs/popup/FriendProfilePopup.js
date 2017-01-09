import app from 'app';
import Component from 'Component';
import NodeRub from 'NodeRub';
import Props from 'Props';

export default class FriendProfilePopup extends Component {
    constructor() {
        super();

        this.propsGridView = {
            default: null,
            type: cc.Layout,
        };

        this.rtUserName = {
            default: null,
            type: cc.RichText,
        };

        this.rtBalance = {
            default: null,
            type: cc.RichText,
        };

        this.bgNode = {
            default: null,
            type: cc.Node
        };

        this.leftBtn = {
            default: null,
            type: cc.Button
        };

        this.rightBtn = {
            default: null,
            type: cc.Button
        };

        // paging
        this.itemsPerPage = 8;
        this.currentPage = 1;

        this.totalPage = null;
        this.totalItems = null;
    }

    onLoad() {
        this._initTouchEvent();

        this._initNodeEvents();

        this.loadPropsAssets();
    }

    _changePaginationState() {
        if (this.currentPage === 1) {
            // hide left Btn
            this.rightBtn.node.active = true;
            this.leftBtn.node.active = false;
        } else if (this.totalPage && this.currentPage === this.totalPage) {
            // hide right Btn
            this.rightBtn.node.active = false;
            this.leftBtn.node.active = true;
        } else {
            this.rightBtn.node.active = true;
            this.leftBtn.node.active = true;
        }
    }

    _initNodeEvents() {
        this.node.on('change-paging-state', this._changePaginationState.bind(this));
    }

    _initTouchEvent() {
        let dialog = this.node.getChildByName('popup_bkg');
        dialog.zIndex = app.const.topupZIndex;

        dialog.on(cc.Node.EventType.TOUCH_START, () => {
            return true;
        });

        this.node.on(cc.Node.EventType.TOUCH_START, () => {
            return true;
        });

        this.bgNode.on(cc.Node.EventType.TOUCH_START, (e) => {
            e.stopPropagationImmediate();
            this.close();
            return true;
        });
    }

    displayUserDetail(userName) {
        this.friendName = userName;
        var sendObject = {
            'cmd': app.commands.SELECT_PROFILE,
            'data': {
                [app.keywords.USER_NAME]: userName
            }
        };

        app.service.send(sendObject, (user) => {
            this.rtUserName.string = `<color=${app.const.HX_COLOR_YELLOW}>Tên:</color> ${user["u"]}`;
            this.rtBalance.string = `<color=${app.const.HX_COLOR_YELLOW}>Số xu:</color> ${user["coin"]}`;
        }, app.const.scene.GAME_SCENE);
    }

    propsItemClicked(e) {
        const prosName = e.target.name;
        this.performAnimation(prosName, this.startAnimNode, this.endAnimNode);
    }

    performAnimation(prosName, startNode, destinationNode) {
        this.node.opacity = 0;

        Props.playPropName(prosName, 'props', 8, startNode, destinationNode, () => {
            this.node.removeFromParent(true);
        });
    }

    setCallbackOptions(startAnimNode, endAnimNode) {
        this.startAnimNode = startAnimNode;
        this.endAnimNode = endAnimNode;
    }

    loadPropsAssets() {
        cc.loader.loadResAll('props/thumbs', cc.SpriteFrame, function(err, assets) {
            if (err) {
                cc.error(err);
                return;
            }

            this.totalItems = assets.length;
            this.totalPage = Math.ceil(this.totalItems / this.itemsPerPage);

            assets.forEach((asset) => {
                // console.debug(`${index} `, asset);
                const clickEvent = new cc.Component.EventHandler();
                clickEvent.target = this.node;
                clickEvent.component = 'FriendProfilePopup';
                clickEvent.handler = 'propsItemClicked';

                let o = {
                    name: asset.name,
                    sprite: {
                        spriteFrame: asset,
                        trim: false,
                        type: cc.Sprite.Type.SIMPLE,
                        sizeMode: cc.Sprite.SizeMode.SIMPLE
                    },
                    button: {
                        event: clickEvent
                    }
                };
                const node = NodeRub.createNodeByOptions(o);

                this.propsGridView.node.addChild(node);
            });

            this.node.emit('change-paging-state');
        }.bind(this));
    }

    onLeftBtnClick(e) {
        e.stopPropagation();
        let cp = this.currentPage;
        if (--cp < 1) {
            this.currentPage = 1;
            return;
        }
        this.currentPage = cp;
        this._runPropsGridViewAction(true);
    }

    onRightBtnClick(e) {
        e.stopPropagation();
        let cp = this.currentPage;
        if (++cp > this.totalPage) {
            this.currentPage = this.totalPage;
            return;
        }
        this.currentPage = cp;
        this._runPropsGridViewAction(false);
    }

    _runPropsGridViewAction(isLeft = true) {
        let width = this.propsGridView.node.parent.getContentSize().width;
        let action = cc.moveBy(0.1, cc.v2(isLeft ? width : -width, 0));
        this.propsGridView.node.runAction(action);
        this.node.emit('change-paging-state');
    }

    kickUser() {
        //kick user khoi ban choi
    }

    inviteFriend() {
        //invite user to be friend
        var sendObject = {
            'cmd': app.commands.BUDDY_INVITE_FRIEND,
            'data': {
                [app.keywords.BUDDY_NAME]: this.friendName
            }
        };

        app.service.send(sendObject, (data) => {
            app.system.showToast(`Đã gửi lời mời kết bạn tới ${data["bn"]}`);
        }, app.const.scene.GAME_SCENE);
    }

    close() {
        this.node.removeFromParent(true);
    }
}

app.createComponent(FriendProfilePopup);