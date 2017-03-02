/**
 * Created by Thanh on 10/25/2016.
 */

import app from 'app';
import Component from 'Component';
import CCUtils from 'CCUtils';

const PROP_SAMPLE = 10;

export default class Props extends Component {

    constructor() {
        super();

        this.propAssets = {};
        this.emotionAssets = {};

        this.propAssetNames = [];
        this.emotionAssetNames = [];
    }

    static loadAllPropAsset() {
        cc.loader.loadResDir('props/', cc.SpriteFrame, (err, assets) => {
            assets.forEach(asset => {
                this.propAssetNames.push(asset.name);
                this.propAssets[asset.name] = asset;
            });
        });

        cc.loader.loadResDir('emotions/', cc.SpriteFrame, (err, assets) => {
            assets.forEach(asset => {
                this.emotionAssetNames.push(asset.name);
                this.emotionAssets[asset.name] = asset;
            });
        });
    }

    static releaseAllPropAsset() {

        Object.values(this.propAssets).forEach(asset => cc.loader.release(asset));
        Object.values(this.emotionAssets).forEach(asset => cc.loader.release(asset));

        this.propAssets = {};
        this.emotionAssets = {};
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
                    CCUtils.destroy(animatingNode);
                });
            });

            animation.play('run');
        }
    }

    static playEmotion(name, node) {
        if (this.emotionAssets.length > 0) {
            let atlas = this.emotionAssets[name];
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
                CCUtils.destroy(animatingNode);
                finishCallback && finishCallback();
            });
        });

        animatingNode.runAction(config.endPos ? cc.sequence(cc.moveTo(0.6, config.endPos), mainAction) : mainAction);
        config = null;
        finishCallback = null;
    }

    static playProp(prosName, config = {
        target: null,
        startPos: null,
        endPos: null,
        sample: PROP_SAMPLE
    }, finishCallback) {
        if (this.propAssets.length > 0) {
            let atlas = this.propAssets[prosName];
            this._playLoadedProp(atlas, config, finishCallback);
        } else {
            this.playPropName(prosName, 'props', config.sample || PROP_SAMPLE, config.startPos, config.endPos, finishCallback);
        }
        config = null;
        finishCallback = null;
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
        let propName = this.propAssetNames[propIndex];
        propName && this.playProp(propName, {
            startPos: CCUtils.getWorldPosition(startNode),
            endPos: CCUtils.getWorldPosition(endNode)
        });
    }
}

app.createComponent(Props);