let RubUtils = {
    loadRes: (resURL, isSpriteFrame = false) => {
        return new Promise((resolve, reject) => {
            function handler(err, asset) {
                if (err)
                    reject(err);

                resolve(asset);
                if (!cc.loader.isAutoRelease(asset)) {
                    cc.loader.setAutoReleaseRecursively(asset, true);
                }
                RubUtils.releaseAssets(asset);
            }

            if (isSpriteFrame) {
                cc.loader.loadRes(resURL, cc.SpriteFrame, handler);
            } else {
                cc.loader.loadRes(resURL, handler);
            }
        });
    },
    getSpriteFrameFromAtlas: (resURL, key, cb) => {
        // load SpriteAtlas (Atlas), and get one of them SpriteFrame
        // Note Atlas resource file (plist) usually of the same name and a picture file (PNG) placed in a directory,
        // So should need to in the second parameter specifies the resource type.
        cc.loader.loadRes(resURL, cc.SpriteAtlas, function(err, atlas) {
            if (err)
                console.error(err);

            let frame = atlas.getSpriteFrame(key);
            cb(frame);
            RubUtils.releaseAssets(frame);
            // sprite.spriteFrame = frame;
        });
    },
    loadFont: (component, url, cb) => {
        cc.loader.loadRes(url, cc.Font, (err, font) => {
            component.font = font;
            cb && cb(font);
            RubUtils.releaseAssets(font)
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
            if (spriteComponent) {
                for (let key in options) {
                    spriteComponent.hasOwnProperty(key) && options[key] && (spriteComponent[key] = options[key]);
                }

                ccSize && spriteComponent.node && spriteComponent.node.setContentSize(ccSize);
                cb && cb(spriteComponent);
            }

        }

        if (isCORS) {
            textureCache = cc.textureCache.addImage(resURL);
            let spriteFrame = new cc.SpriteFrame(textureCache);
            spriteComponent.spriteFrame = spriteFrame;
            spriteFrameDefaultConfig(spriteComponent);
        } else {
            return RubUtils.loadRes(resURL, true).then((spriteFrame) => {
                if (spriteFrame) {
                    spriteComponent.spriteFrame = spriteFrame;
                    spriteFrameDefaultConfig(spriteComponent);
                }
            });
        }
    },
    calcWidthByGroup: (parentWidth, widths = [], spaceX = 0) => {
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

        if (ins.length < 0)
            return;
        ins.map(asset => {
            let deps = asset && cc.loader.getDependsRecursively(asset);
            if (deps && deps.length > 0) {
                cc.loader.release(asset);
            }
        });
        window.release(ins, true);
    }
};
export default RubUtils;