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
     * @param spriteComponent: (cc.Component) sprite we need to add spriteFrame to
     * @param resURL: (string) resource url || image url we need to load before adding
     * @param ccSize: (cc.size), used to resize spriteFrame to slice image fit to current node ( node will be reset its size based on spriteFrame's size after adding )
     * @param cb: (function) callback function
     * @param isCORS: (boolean) if resURL is http protocol, it need to be `true`
     * @param options: (any) spriteFrame options
     * {
     *  type: cc.Sprite.Type.SLICE,
     *  sizeMode: cc.Sprite.SizeMode.CUSTOM,
     *  trim: boolean,
     * }
     */
    loadSpriteFrame: (spriteComponent, resURL, ccSize = null, isCORS = false, cb, options = {}) => {
        let textureCache;
        let o = {
            type: cc.Sprite.Type.SLICED,
            sizeMode: cc.Sprite.SizeMode.CUSTOM
        };
        options = Object.assign({}, o, options);

        function spriteFrameDefaultConfig(spriteComponent) {
            for (let key in options) {
                spriteComponent[key] = options[key];
            }

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
        let totalWidth = widths.reduce((p, n) => !isNaN(p) && (Number(p) + Number(n)), 0);

        // remaing array which cotains null -> ["", null...]
        let remains = widths.filter((e) => !isNaN(e) && Number(e) === 0).length;

        // remaining width for null array, it will be equally divided.
        let n = parentWidth > totalWidth ? parentWidth - totalWidth : 0;
        let equallyDivided = n / remains;

        return widths.map((e) => {
            let number = ((e === null && Number(e) === 0 && equallyDivided) || e) - spaceX;
            return number > 0 ? number : 0;
        });
    },
    // usefull when assets is prefab
    releaseAssets: (assets) => {
        let ins = assets;

        if (!(assets instanceof Array))
            ins = [assets];
        if (assets instanceof Object) {
            for (let key in assets) {
                ins.push(assets[key]);
            }
        }

        ins.map(asset => {
            let deps = cc.loader.getDependsRecursively(asset);
            cc.loader.release(deps);
        });
    }
};
export default RubUtils;