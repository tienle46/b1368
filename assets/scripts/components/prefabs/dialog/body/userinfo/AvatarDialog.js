import app from 'app';
import DialogActor from 'DialogActor';
import { destroy } from 'CCUtils';
import HttpImageLoader from 'HttpImageLoader';
import RubUtils from 'RubUtils';

export default class AvatarDialog extends DialogActor {
    constructor() {
        super();

        this.properties = {
            ...this.properties,
            bgNode: cc.Node,
            itemContainerNode: cc.Node,
            itemNode: cc.Node,
            itemAvatar: cc.Sprite,
            itemLbl: cc.Label,
            detailAvatarNode: cc.Node,
            pickedAvatarSprite: cc.Sprite,
            pickedAvatarLbl: cc.Label,
            pickedAvatarDescription: cc.Label,
        };
        
        this.previousLabel = null;
        this.selectedURL = null;
    }

    onLoad() {
        super.onLoad();
        this.bgNode && this.bgNode.on(cc.Node.EventType.TOUCH_START, () => true)
    }

    start() {
        super.start();
        this._getListAvatars();
    }
    
    onDestroy() {
        super.onDestroy();
    }
    
    onClickAvatarItem(toggle) {
        let node = toggle.node;
        let {name, description, spriteFrame, url} = node.data;
        this.pickedAvatarSprite.spriteFrame = spriteFrame;
        this.pickedAvatarLbl.string = name;
        this.selectedURL = url;
        this.pickedAvatarDescription.string = description;
        
        let lbl = node.getComponentInChildren(cc.Label);
        if(lbl) {
            this.previousLabel && (this.previousLabel.node.color = app.const.COLOR_WHITE);
            this.previousLabel = lbl;
            lbl && (lbl.node.color = app.const.COLOR_YELLOW);
        }
    }
    
    onConfirmBtnClick() {
        let resObj = {
            cmd: app.commands.CHANGE_AVATAR,
            data:{
                [app.keywords.CHANGE_AVATAR_URL]: this.selectedURL
            }
        };
        
        app.service.send(resObj);    
    }
    
    _addGlobalListener() {
        super._addGlobalListener();
        app.system.addListener(app.commands.USER_AVATARS, this._onListUserAvatars, this);
        app.system.addListener(app.commands.CHANGE_AVATAR, this._onUserChangeAvatar, this);
    }

    _removeGlobalListener() {
        super._removeGlobalListener();
        app.system.removeListener(app.commands.USER_AVATARS, this._onListUserAvatars, this);
        app.system.removeListener(app.commands.CHANGE_AVATAR, this._onUserChangeAvatar, this);
    }
    
    _getListAvatars() {
        let sendObj = {
            cmd: app.commands.USER_AVATARS
        };
        
        app.service.send(sendObj);
    }
    
    _onUserChangeAvatar(data) {
         if (data[app.keywords.RESPONSE_RESULT]) {
            app.system.showToast('Bạn đã đổi hình đại diện thành công !');
            this.onCloseBtnClick();
            // app.system.showToast(app.res.string('phone_number_confirmation'));
        } else {
            app.system.error(
                app.res.string('error_system')
            );
        }
    }
    
    _onListUserAvatars(data) {
        let {avatarUrls} = data;
        avatarUrls && avatarUrls.forEach((avatar, index) => {
            let {url, name, desc} = avatar;
            
            // this.itemAvatar.spriteFrame = HttpImageLoader.loadImage(url, 'AvatarDialog');
            RubUtils.loadSpriteFrame(this.itemAvatar, url, null, true, (sprite) => {
                this.itemLbl.string = name;
                let item = cc.instantiate(this.itemNode);
                item.active = true;
                item.data = {
                    name,
                    description: desc,
                    spriteFrame: sprite.spriteFrame,
                    url
                };
                
                let toggle = item.getComponent(cc.Toggle);
                if(toggle) {
                    toggle.isChecked = index === 0;
                    toggle.isChecked && this.onClickAvatarItem(toggle);
                }
                this.itemContainerNode.addChild(item);
            });
            // this.itemLbl.string = name;
            // let item = cc.instantiate(this.itemNode);
            // item.active = true;
            // item.data = {
            //     name,
            //     description: desc,
            //     spriteFrame: this.itemAvatar.spriteFrame,
            //     url
            // };
            
            // let toggle = item.getComponent(cc.Toggle);
            // if(toggle) {
            //     toggle.isChecked = index === 0;
            //     toggle.isChecked && this.onClickAvatarItem(toggle);
            // }
            // this.itemContainerNode.addChild(item);
        })    
    }
    
    onCloseBtnClick() {
        HttpImageLoader.clearImage('AvatarDialog');    
        destroy(this.node);
    }
}

app.createComponent(AvatarDialog);