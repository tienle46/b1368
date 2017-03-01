/**
 * Created by Thanh on 3/1/2017.
 */

import app from 'app'
import Utils from 'Utils';

class HttpImageLoader {

    constructor() {
        this.loadedImageUrl = {
            default: []
        };
    }

    loadDefaultAvatar(avatarSprite){
        if(!avatarSprite) return;
        let spriteFrame = Utils.isEmpty(app.config.defaultAvatarUrl) ? this._loadDefaultAvatarLocal() : this.loadImage(app.config.defaultAvatarUrl)
        spriteFrame && (avatarSprite.spriteFrame = spriteFrame)
    }

    _loadDefaultAvatarLocal(){
        //TODO
    }

    clearImage(payload = 'default'){
        let keys = this.loadedImageUrl[payload];
        keys && keys.forEach(key => {
            cc.textureCache.removeTextureForKey(key);
        });
        delete this.loadedImageUrl[payload];
    }

    clearImageByUrl(url){
        Object.keys.forEach(keys => {
            let filteredKeys = keys.filter(key => key === url);
            if(filteredKeys. length > 0){
                filteredKeys.forEach(key => {
                    cc.textureCache.removeTextureForKey(key);
                    let index = keys.indexOf(key);
                    index >= 0 && keys.splice(index, 1);
                });
            }
        });
    }

    /**
     * @param url : http image url
     * @param payload : playload to manager url
     * @return {cc.SpriteFrame}
     */
    loadImage(url, payload = 'default', cb = () => {}){

        let texture = cc.textureCache.addImage(url, cb);
        if(texture){
            let urls = this.loadedImageUrl[payload];

            if(!urls){
                urls = [];
                this.loadedImageUrl[payload] = urls;
            }
            urls.push(url);

            return new cc.SpriteFrame(texture);
        }
    }

    loadImageToSprite(sprite, url, playload = 'default'){
        let spriteFrame = this.loadImage(url, playload);
        spriteFrame && (sprite.spriteFrame = spriteFrame);
    }

}

export default new HttpImageLoader();