/**
 * Created by Thanh on 10/25/2016.
 */

import app from 'app';
import Component from 'Component';
import CCUtils from 'CCUtils';

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

        window.free(propAssets, emotionAssets);
        window.release([propAssetNames, emotionAssetNames], true);
    }

    static _playLoadedEmotion(atlas, node) {
        if (atlas && atlas.getSpriteFrames().length > 0) {

            const animatingNode = new cc.Node();
            const animation = animatingNode.addComponent(cc.Animation);

            const sprite = animatingNode.addComponent(cc.Sprite);
            sprite.trim = false;
            sprite.spriteFrame = atlas.getSpriteFrames()[0];

            node.addChild(animatingNode);
            let clip = cc.AnimationClip.createWithSpriteFrames(atlas.getSpriteFrames(), 5);
            clip.name = 'run';
            clip.wrapMode = cc.WrapMode.Default;
            animation.addClip(clip);

            animation.on('finished', () => {
                animation.play('run');
                animation.on('finished', () => {
                    animatingNode.destroy();
                    animatingNode.removeFromParent(true);
                });
            });

            animation.play('run');
        }
    }

    static playEmotion(name, node) {
        if (emotionAssets.length > 0) {
            let atlas = emotionAssets[name];
            this._playLoadedEmotion(atlas, node);
        } else {
            cc.loader.loadRes(`emotions/${name}`, cc.SpriteAtlas, (err, atlas) => {
                if (err) {
                    console.warn(err);
                } else {
                    this._playLoadedEmotion(atlas, node);
                }
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

            animation.addClip(clip);
            animation.play('run');
            animation.on('finished', () => {
                animatingNode.destroy();
                animatingNode.removeFromParent(true);
                finishCallback && finishCallback();
            });
            window.free(config, finishCallback);
        });

        animatingNode.runAction(config.endPos ? cc.sequence(cc.moveTo(0.6, config.endPos), mainAction) : mainAction);
    }

    static playProp(prosName, config = {
        target: null,
        startPos: null,
        endPos: null,
        sample: PROP_SAMPLE
    }, finishCallback) {
        if (propAssets.length > 0) {
            let atlas = propAssets[prosName];
            this._playLoadedProp(atlas, config, finishCallback);
        } else {
            this.playPropName(prosName, 'props', config.sample || PROP_SAMPLE, config.startPos, config.endPos, finishCallback)
        }
    }

    static playPropName(prosName, resPath, sample, startPos, endPos, finishCallback) {

        cc.loader.loadRes(`${resPath}/${prosName}`, cc.SpriteAtlas, (err, atlas) => {

            if (err || atlas.getSpriteFrames().length == 0) {
                err && debug(err);
                return;
            }

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