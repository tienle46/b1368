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
    loadSpriteFrame: (spriteComponent, resURL, ccSize = null, isCORS = false, cb) => {
        let textureCache;

        function spriteFrameDefaultConfig(spriteComponent) {
            spriteComponent.type = cc.Sprite.Type.SLICED;
            spriteComponent.sizeMode = cc.Sprite.SizeMode.CUSTOM;
            ccSize && spriteComponent.node.setContentSize(ccSize);
            cb && cb(spriteComponent);
        }

        if (isCORS) {
            textureCache = cc.textureCache.addImage(resURL);
            let spriteFrame = new cc.SpriteFrame(textureCache);
            spriteComponent.spriteFrame = spriteFrame;
            spriteFrameDefaultConfig(spriteComponent);

        } else {
            return RubUtils.loadRes(resURL, true).then((spriteFrame) => {
                spriteFrame && (spriteComponent.spriteFrame = spriteFrame);
                spriteFrameDefaultConfig(spriteComponent);

            });
        }
    },
    calcWidthByGroup: (parentWidth, widths = [], spaceX = 0, padding = 0) => {
        // parentWidth -= 2 * padding;

        // ['', '10%', 30, '']
        widths = widths.map((width) => {
            let w;

            if (width) {
                if (!isNaN(Number(width))) {
                    w = Number(width);
                } else {
                    if (width.indexOf('%') > 0) {
                        w = Number(width.replace('%', '')) * parentWidth / 100;
                    } else
                        w = null;
                }
                if (w && w < 0)
                    w = null;
            } else
                w = null;

            return w;
        }); // => [null, 10*parentWidth/100, 30, null]

        // total width inside array
        let totalWidth = widths.reduce((p, n) => !isNaN(p) && (Number(p) + Number(n)));

        // remaing array which cotains null -> ["", null...]
        let remains = widths.filter((e) => !isNaN(e) && Number(e) === 0).length;

        // remaining width for null array, it will be equally divided.
        let n = parentWidth > totalWidth ? parentWidth - totalWidth : 0;
        let equallyDivided = n / remains;

        return widths.map((e) => {
            let number = ((e === null && Number(e) === 0 && equallyDivided) || e) - spaceX - padding / widths.length;
            return number > 0 ? number : 0;
        });
    }
};
export default RubUtils;