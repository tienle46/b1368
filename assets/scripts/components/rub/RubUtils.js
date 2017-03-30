import app from 'app';

let RubUtils = {
    /**
     * @resURL {string}
     * @assetType {cc.SpriteFrame || cc.Font || cc.SpriteAtlas ...}
     */
    loadRes: (resURL, assetType = null) => {
        return new Promise((resolve, reject) => {
            function handler(err, asset) {
                if (err)
                    reject(err);

                resolve(asset);

                RubUtils.releaseAssets(asset);
            }

            if (assetType) {
                cc.loader.loadRes(resURL, assetType, handler);
            } else {
                cc.loader.loadRes(resURL, handler);
            }
        });
    },
    getAtlasFromUrl: (url, cb) => {
        RubUtils.loadRes(url, cc.SpriteAtlas).then((atlas) => {
            cb && cb(atlas);
        }).catch(err => console.error(err));
    },
    getSpriteFrameFromAtlas: (atlasURL, key, cb) => {
        // load SpriteAtlas (Atlas), and get one of them SpriteFrame
        // Note Atlas resource file (plist) usually of the same name and a picture file (PNG) placed in a directory,
        // So should need to in the second parameter specifies the resource type.
        RubUtils.getAtlasFromUrl(atlasURL, (atlas) => {
            let frame = atlas.getSpriteFrame(key);
            cb && cb(frame);
        });
    },
    /**
     * @return callback(sprites)
     */
    getSpriteFramesFromAtlas: (atlasURL, keys, callback) => {
        var async = require('async');

        if (!(keys instanceof Array) || keys.length < 1)
            return;

        let sprites = {};
        let count = 0;

        async.mapSeries(keys, (key, cb) => {
            RubUtils.getSpriteFrameFromAtlas(atlasURL, key, (sprite) => {
                if (sprite) {
                    count++;
                    sprites[key] = sprite;
                }
                if (count == keys.length) {
                    callback(sprites);
                    window.free(sprites);
                }

                cb && cb(); // next ->
            });
        });
    },
    loadFont: (component, url, cb) => {
        RubUtils.loadRes(url, cc.Font).then((font) => {
            component.font = font;
            cb && cb(font);
        }).catch(err => console.error(err));
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
        if(!resURL)
            return ;
        
        let textureCache;

        let o = {
            type: cc.Sprite.Type.SLICED,
            sizeMode: cc.Sprite.SizeMode.CUSTOM
        };
        options = Object.assign({}, o, options);

        function spriteFrameDefaultConfig(spriteComponent, texture2D) {
            if (spriteComponent) {
                spriteComponent.spriteFrame = new cc.SpriteFrame(texture2D);
                
                for (let key in options) {
                    spriteComponent.hasOwnProperty(key) && options[key] && (spriteComponent[key] = options[key]);
                }

                ccSize && spriteComponent.node && spriteComponent.node.setContentSize(ccSize);
                cb && cb(spriteComponent);
            }
        }

        if (isCORS) {
            if(!resURL.match(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/))
                return;
                 
            if (app.env.isBrowser()) {
                textureCache = cc.textureCache.addImage(resURL);
                
                spriteFrameDefaultConfig(spriteComponent, textureCache);
            } else {
                cc.loader.load(resURL, (err, tex) => {
                    if(err) console.error(err);
                    
                    if (tex && tex instanceof cc.Texture2D) {
                        spriteFrameDefaultConfig(spriteComponent, tex);
                    }
                });
            }
        } else {
            return RubUtils.loadRes(resURL, cc.SpriteFrame).then((spriteFrame) => {
                if (spriteFrame) {
                    spriteComponent.spriteFrame = spriteFrame;
                    spriteFrameDefaultConfig(spriteComponent);
                }
            }).catch(err => console.error(err));
        }
    },
    // usefull when assets is prefab
    releaseAssets: (assets) => {
        let ins = assets;

        if (!(assets instanceof Array))
            ins = [assets];

        if (ins.length < 0)
            return;
        ins.map(asset => {
            if (asset) {
                if (!cc.loader.isAutoRelease(asset)) {
                    if (asset._name && (asset._name == "loading_rotate_img" || asset._name == "loading_fixed_img"))
                        cc.loader.setAutoRelease(asset, true);
                    else
                        cc.loader.setAutoReleaseRecursively(asset, true);
                }

                let deps = cc.loader.getDependsRecursively(asset);
                deps && deps.length > 0 && cc.loader.release(asset);
            }
        });
        window.release(ins, true);
    }
};
export default RubUtils;