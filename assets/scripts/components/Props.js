/**
 * Created by Thanh on 10/25/2016.
 */

import app from 'app';
import Component from 'Component';
import CCUtils from 'CCUtils';
import RubUtils from 'RubUtils';

let propAssets = {};
let emotionAssets = {};

let propAssetNames = [];
let emotionAssetNames = [];

const PROP_SAMPLE = 10;

export default class Props extends Component {

    constructor() {
        super();
    }

    static loadAllPropAsset() {
        cc.loader.loadResDir('props/', cc.SpriteFrame, (err, assets) => {
            assets.forEach(asset => {
                if (!cc.loader.isAutoRelease(asset))
                    cc.loader.setAutoRelease(asset, true);
                propAssetNames.push(asset.name);
                propAssets[asset.name] = asset;
            });
        });

        cc.loader.loadResDir('emotions/', cc.SpriteFrame, (err, assets) => {
            assets.forEach(asset => {
                if (!cc.loader.isAutoRelease(asset))
                    cc.loader.setAutoRelease(asset, true);

                emotionAssetNames.push(asset.name);
                emotionAssets[asset.name] = asset;
            });
        });
    }

    static releaseAllPropAsset() {
        Object.values(propAssets).forEach(asset => cc.loader.release(asset));
        Object.values(emotionAssets).forEach(asset => cc.loader.release(asset));

        propAssets = {};
        emotionAssets = {};
        window.release([propAssetNames, emotionAssetNames], true);
    }

    static _playLoadedEmotion(atlas, node) {
        if (atlas && atlas.getSpriteFrames().length > 0) {

            const animatingNode = new cc.Node();
            const animation = animatingNode.addComponent(cc.Animation);

            const sprite = animatingNode.addComponent(cc.Sprite);
            let spriteFrames = atlas.getSpriteFrames();
            sprite.trim = false;
            sprite.spriteFrame = spriteFrames[0];            
            node.addChild(animatingNode);
            
            let clip = cc.AnimationClip.createWithSpriteFrames(spriteFrames, 5);
            clip.name = 'run';
            clip.wrapMode = cc.WrapMode.Normal;
            animation.addClip(clip);

            animation.on('finished', () => {
                if(spriteFrames.length > 3) { // remove 1st spriteFrame when it contains 4 frames
                    spriteFrames.shift();
                    animation.removeClip(clip,true);
                    clip = cc.AnimationClip.createWithSpriteFrames(spriteFrames, 5);
                    clip.name = 'run';
                    clip.wrapMode = cc.WrapMode.Normal;
                    animation.addClip(clip);
                }
                
                animation.play('run');
                animation.on('finished', () => {
                    if(spriteFrames.length > 3) { // remove 1st spriteFrame when it contains 4 frames
                        spriteFrames.shift();
                        animation.removeClip(clip,true);
                        clip = cc.AnimationClip.createWithSpriteFrames(spriteFrames, 5);
                        clip.name = 'run';
                        clip.wrapMode = cc.WrapMode.Normal;
                        animation.addClip(clip);
                    }

                    animation.play('run');
                    animation.on('finished', () => {
                        animatingNode.destroy();
                        animatingNode.removeFromParent(true);
                    });
                    //
                    // animatingNode.destroy();
                    // animatingNode.removeFromParent(true);
                });
            });

            animation.play('run');
        }
    }

    static playEmotion(name, node) {
        if (Object.keys(emotionAssets).length > 0) {
            let atlas = emotionAssets[name];
            this._playLoadedEmotion(atlas, node);
        } else {
            RubUtils.getAtlasFromUrl(`emotions/${name}`, (atlas) => {
                this._playLoadedEmotion(atlas, node);
            });
        }
    }

    static _playLoadedProp(atlas, config = {
        target: null,
        startPos: null,
        endPos: null,
        sample: PROP_SAMPLE
    }, finishCallback) {
        if (!atlas || !config.startPos) return;
        
        const animatingNode = new cc.Node();
        const animation = animatingNode.addComponent(cc.Animation);

        const sprite = animatingNode.addComponent(cc.Sprite);
        sprite.trim = false;
        sprite.spriteFrame = atlas.getSpriteFrames()[0];

        animatingNode.position = config.startPos;

        if (config.target && config.target instanceof cc.Node) {
            config.target.addChild(animatingNode);
        } else {
            cc.director.getScene().addChild(animatingNode);
        }

        let mainAction = cc.callFunc(() => {
            let spriteFrames = atlas.getSpriteFrames();
            let clip = cc.AnimationClip.createWithSpriteFrames(spriteFrames, config.sample || PROP_SAMPLE);
            clip.name = 'run';
            clip.wrapMode = cc.WrapMode.Default;
            
            let names = atlas.name.split('.');
            if(names && names[0]) {
                let name = names[0];
                let soundSource = `${name.charAt(0)}${name.slice(1).replace(/([A-Z])/g,($1) => `_${$1.toLowerCase()}`)}`.toUpperCase(); 

                if(app.system.audioManager[`PROPS_${soundSource}`]) {
                    app.system.audioManager.play(app.system.audioManager[`PROPS_${soundSource}`]);
                }
            }
            
            animation.addClip(clip);
            animation.play('run');
            animation.on('finished', () => {
                animatingNode.destroy();
                animatingNode.removeFromParent(true);
                finishCallback && finishCallback();
            });
            config = null;
            finishCallback = null;
        });

        animatingNode.runAction(config.endPos ? cc.sequence(cc.moveTo(0.6, config.endPos), mainAction) : mainAction);
    }

    static playProp(prosName, config = {
        target: null,
        startPos: null,
        endPos: null,
        sample: PROP_SAMPLE
    }, finishCallback) {
        if (Object.keys(propAssets).length > 0) {
            let atlas = propAssets[prosName];
            this._playLoadedProp(atlas, config, finishCallback);
        } else {
            this.playPropName(prosName, 'props', config.sample || PROP_SAMPLE, config.startPos, config.endPos, finishCallback)
        }
    }

    static playPropName(prosName, resPath, sample, startPos, endPos, finishCallback) {
        RubUtils.getAtlasFromUrl(`${resPath}/${prosName}`, (atlas) => {
            this._playLoadedProp(atlas, { startPos, endPos }, finishCallback);
        });
    }

    static playPropAtIndex(propIndex, startNode, endNode) {
        let propName = propAssetNames[propIndex];
        propName && this.playProp(propName, {
            startPos: CCUtils.getWorldPosition(startNode),
            endPos: CCUtils.getWorldPosition(endNode)
        });
    }
}

app.createComponent(Props);