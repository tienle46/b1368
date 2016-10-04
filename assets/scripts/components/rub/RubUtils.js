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
    loadSpriteFrame: (spriteComponent, resURL, cb, isCORS = false) => {
        let textureCache;

        function spriteFrameDefaultConfig(spriteComponent) {
            spriteComponent.type = cc.Sprite.Type.SLICED;
            spriteComponent.sizeMode = cc.Sprite.SizeMode.CUSTOM;
            cb(spriteComponent);
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