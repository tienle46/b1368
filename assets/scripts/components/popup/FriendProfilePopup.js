import app from 'app';
import utils from 'utils';
import DialogActor from 'DialogActor';
import GameUtils from 'GameUtils';
import Props from 'Props';
import numeral from 'numeral';
import CCUtils from 'CCUtils';

export default class FriendProfilePopup extends DialogActor {
    constructor() {
        super();

        this.properties = {
            ...this.properties,
            propsGridView: cc.Layout,
            rtUserName: cc.Label,
            rtBalance: cc.Label,
            userAvatar: cc.Sprite,
            bgNode: cc.Node,
            assetItemNode: cc.Node,
            assetItemSprite: cc.Sprite,
            kickBtn: cc.Button,
            addFriendBtn: cc.Button,
            vipNode: cc.Node
        };

        // paging
        this.itemsPerPage = 18;
        this.currentPage = 1;

        this.totalPage = null;
        this.totalItems = null;

        this.friendId = null;
        this.isOwner = null;
        this.kickable = null;
        this.friendName = null;
    }

    onLoad() {
        super.onLoad();
        
        this._initTouchEvent();

        this._initNodeEvents();

        this.loadPropsAssets();
    }

    onEnable() {
        super.onEnable();

        utils.setInteractable(this.addFriendBtn, !(this.friendName && app.buddyManager.containsBuddy(this.friendName)));
    }

    start() {
        super.start();
    }

    displayUserDetail(user, userId, avatarURL, isOwner) {
        this.user = user;
        this.friendName = user.name;
        this.friendId = userId;
        avatarURL && app.context.loadUserAvatarByURL(avatarURL, this.userAvatar);
        this.kickable = app.context.getLastJoinedRoom().variables.kickable.value;

        CCUtils.setActive(this.kickBtn, isOwner && app.buddyManager.shouldRequestBuddy(user.name));

        var sendObject = {
            'cmd': app.commands.SELECT_PROFILE,
            'data': {
                [app.keywords.USER_NAME]: userName
            }
        };

        app.service.send(sendObject);
    }

    performAnimation(prosName, startNode, destinationNode) {
        this.node.opacity = 0;

        Props.playProp(prosName, { startPos: CCUtils.getWorldPosition(startNode), endPos: CCUtils.getWorldPosition(destinationNode) }, () => {
            CCUtils.destroy(this.node);
        });
    }

    setCallbackOptions(startAnimNode, endAnimNode) {
        this.startAnimNode = startAnimNode;
        this.endAnimNode = endAnimNode;
    }

    loadPropsAssets() {
        let assets = Object.values(app.res.asset_tools);
        this.totalItems = assets.length;
        this.totalPage = Math.ceil(this.totalItems / this.itemsPerPage);
        assets.map(asset => {
            this.assetItemSprite.spriteFrame = asset.spriteFrame;
            this.vipNode.active = app.res.vip_tools[asset.name] || false;
            let assetNode = cc.instantiate(this.assetItemNode);
            assetNode.name = asset.name;
            assetNode.active = true;

            this.propsGridView && this.propsGridView.node.addChild(assetNode);
        })
    }

    propsItemClicked(e) {
        const prosName = e.target.name;
        if(!app.context.isVip() && app.res.vip_tools[prosName]) {
            app.system.showToast(app.res.string('error_vip_only'));
            return;
        }
        let itemId = app.res.asset_tools[prosName].id,
            ev = new cc.Event.EventCustom('on.asset.picked', true);
        
        let sendObject = {
            cmd: app.commands.ASSETS_USE_ITEM,
            data: {
                [app.keywords.ASSETS_DAOCU_ITEM_USED_ID]: itemId,
                [app.keywords.STORE_TYPE]: 3,
                [app.keywords.ASSETS_ITEM_USED_RECEIVER]: this.friendName
            }
        };

        app.service.send(sendObject);

        CCUtils.destroy(this.node);
    }

    kickUser() {

        if (!this.kickable) {
            app.system.showToast(app.res.string('error_function_does_not_support'));
        } else {
            if (this.friendId) {
                this._onKickUser(this.friendId);
            }
        }
    }

    inviteFriend() {
        app.buddyManager.requestAddBuddy(this.friendName);
        CCUtils.setActive(this.kickBtn, false);
    }

    close() {
        CCUtils.destroy(this.node);
    }

    _addGlobalListener() {
        super._addGlobalListener();
        app.system.addListener(app.commands.SELECT_PROFILE, this._onSelectUserProfile, this);
        app.system.addListener(app.commands.BUDDY_INVITE_FRIEND, this._onBuddyInviateFriend, this);
    }

    _removeGlobalListener() {
        super._removeGlobalListener();
        app.system.removeListener(app.commands.SELECT_PROFILE, this._onSelectUserProfile, this);
        app.system.removeListener(app.commands.BUDDY_INVITE_FRIEND, this._onBuddyInviateFriend, this);
    }

    _onKickUser() {

        let meVipLevel = GameUtils.getUserVipLevel(app.context.getMe());
        let kickVipLevel = GameUtils.getUserVipLevel(this.user);

        if(meVipLevel >= kickVipLevel){
            //kick user khoi ban choi
            var sendObject = {
                'cmd': app.commands.PLAYER_KICK,
                data: {
                    [app.keywords.USER_ID]: this.friendId
                },
                room: app.context.getLastJoinedRoom()
            };

            app.service.send(sendObject);
        }else{
            app.system.showToast(app.res.string("error_cannot_kick_player_vip"))
        }

        this.close()
    }

    _changePaginationState() {
        this.leftBtn.node.active = !(this.currentPage === 1);
        this.rightBtn.node.active = !(this.totalPage && this.currentPage === this.totalPage);
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

    _onSelectUserProfile(user) {
        this.rtUserName.string = `${user["u"]}`;
        this.rtBalance.string = `${utils.numberFormat(user["coin"])}`;
    }

    _runPropsGridViewAction(isLeft = true) {
        let width = this.propsGridView.node.parent.getContentSize().width;
        let action = cc.moveBy(0.1, cc.v2(isLeft ? width : -width, 0));
        this.propsGridView.node.runAction(action);
        this.node.emit('change-paging-state');
    }

    _onBuddyInviateFriend(data) {
        app.system.showToast(`Đã gửi lời mời kết bạn tới ${data[app.keywords.BUDDY_NAME]}`);
    }
}

app.createComponent(FriendProfilePopup);