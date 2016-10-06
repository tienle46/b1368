let RubUtils = {
    loadRes: (resURL, isSpriteFrame = false) => {
        return new Promise((resolve, reject) => {
            function handler(err, prefab) {
                if (err)
                    reject(err);

                resolve(prefab);
            }

            if (isSpriteFrame) {
                cc.loader.loadRes(resURL, cc.SpriteFrame, handler);
            } else {
                cc.loader.loadRes(resURL, handler);
            }
        });
    },

    /**
     * @spriteComponent: (cc.Component) sprite we need to add spriteFrame to
     * @resURL: (string) resource url || image url we need to load before adding
     * @ccSize: (cc.size), used to resize spriteFrame to slice image fit to current node ( node will be reset its size based on spriteFrame's size after adding )
     * cb: (function) callback function
     * isCORS: (boolean) if resURL is http protocol, it need to be `true`
     */
    loadSpriteFrame: (spriteComponent, resURL, ccSize, isCORS = false, cb) => {
        let textureCache;

        function spriteFrameDefaultConfig(spriteComponent) {
            spriteComponent.type = cc.Sprite.Type.SLICED;
            spriteComponent.sizeMode = cc.Sprite.SizeMode.CUSTOM;
            spriteComponent.node.setContentSize(ccSize);
            cb && cb(spriteComponent);
        }

        if (isCORS) {
            textureCache = cc.textureCache.addImage(resURL);
            let spriteFrame = new cc.SpriteFrame(textureCache);
            spriteComponent.spriteFrame = spriteFrame;
            spriteFrameDefaultConfig(spriteComponent);
        } else {
            RubUtils.loadRes(resURL, true).then((spriteFrame) => {
                spriteComponent.spriteFrame = spriteFrame;
                spriteFrameDefaultConfig(spriteComponent);
            });
        }
    }
};
export default RubUtils;