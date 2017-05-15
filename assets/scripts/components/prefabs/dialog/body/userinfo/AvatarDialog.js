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
        this.selectedObject = null;
    }

    onLoad() {
        super.onLoad();
        this.bgNode && this.bgNode.on(cc.Node.EventType.TOUCH_START, () => true);
        this.previousLabel = null;
        this.selectedObject = null;
    }

    start() {
        super.start();
        this._getListAvatars();
    }
    
    onDestroy() {
        super.onDestroy();
        this.previousLabel = null;
        this.selectedObject = null;
    }
    
    onClickAvatarItem(toggle) {
        let node = toggle.node;
        let {name, description, thumb, large, vipValue} = node.data;
        RubUtils.loadSpriteFrame(this.pickedAvatarSprite, large, null, true, (sprite) =>{
            this.pickedAvatarLbl.string = name;
            this.selectedObject = {
                thumb, large, vipValue
            };
            this.pickedAvatarDescription.string = description;
            
            let lbl = node.getComponentInChildren(cc.Label);
            if(lbl) {
                this.previousLabel && (this.previousLabel.node.color = app.const.COLOR_WHITE);
                this.previousLabel = lbl;
                lbl && (lbl.node.color = app.const.COLOR_YELLOW);
            }
        });
    }
    
    onConfirmBtnClick() {
        let {thumb, large, vipValue} = this.selectedObject;
        
        if(app.context.getVipLevel() < vipValue) {
            app.system.showToast(app.res.string('error_dont_have_permission'));
            return;    
        }
        
        let resObj = {
            cmd: app.commands.CHANGE_AVATAR,
            data:{
                thumb, large
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
            // this.onCloseBtnClick();
            // app.system.showToast(app.res.string('phone_number_confirmation'));
        } else {
            app.system.error(
                app.res.string('error_system')
            );
        }
    }
    
    _onListUserAvatars(data) {
        let {avatarUrls} = data;
        
        let index = 0;
        app.async.mapSeries(avatarUrls, (avatar, cb) => {
            let {thumb, large, name, desc, vipValue} = avatar;
            let url = thumb;
            // this.itemAvatar.spriteFrame = HttpImageLoader.loadImage(url, 'AvatarDialog');
            url && RubUtils.loadSpriteFrame(this.itemAvatar, url, null, true, (sprite) => {
                this.itemLbl.string = name;
                let item = cc.instantiate(this.itemNode);
                item.active = true;
                if(sprite){
                    item.data = {
                        name,
                        description: desc,
                        thumb,
                        large,
                        vipValue
                    };
                    
                    let toggle = item.getComponent(cc.Toggle);
                    if(toggle) {
                        toggle.isChecked = index === 0;
                        toggle.isChecked && this.onClickAvatarItem(toggle);
                    }
                }
                this.itemContainerNode.addChild(item);
                index ++;
                cb();                
            });
        });
    }
    
    onCloseBtnClick() {
        HttpImageLoader.clearImage('AvatarDialog');    
        destroy(this.node);
    }
}

app.createComponent(AvatarDialog);