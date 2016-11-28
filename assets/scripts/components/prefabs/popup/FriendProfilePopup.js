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
        }
    }

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, () => {
            return null;
        });
        this.bgNode.on(cc.Node.EventType.TOUCH_START, ((e) => {
            e.stopPropagationImmediate();
            this.close();
        }).bind(this));

        this.loadPropsAssets();
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

        Props.playPropName(prosName, startNode, destinationNode, () => {
            this.node.removeFromParent();
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

            assets.forEach((asset) => {
                // console.debug(`${index} `, asset);
                const clickEvent = new cc.Component.EventHandler();
                clickEvent.target = this.node;
                clickEvent.component = 'FriendProfilePopup';
                clickEvent.handler = 'propsItemClicked';

                let o = {
                    name: asset.name,
                    size: cc.size(75, 75),
                    sprite: {
                        spriteFrame: asset,
                        trim: true,
                        type: cc.Sprite.Type.SIMPLE,
                        sizeMode: cc.Sprite.SizeMode.CUSTOM
                    },
                    button: {
                        event: clickEvent
                    }
                };
                const node = NodeRub.createNodeByOptions(o);

                this.propsGridView.node.addChild(node);
            });
        }.bind(this));
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
        this.node.removeFromParent();
    }
}

app.createComponent(FriendProfilePopup);