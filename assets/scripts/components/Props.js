/**
 * Created by Thanh on 10/25/2016.
 */

import app from 'app';
import Component from 'Component';

var props = [
    "hddj-1",
    "hddj-2",
    "hddj-3",
    "hddj-5",
    "hddj-6",
    "hddj-7",
    "hddj-8",
    "hddj-9",
    "hddj-11",
    "hddj-12",
]

export default class Props extends Component {

    constructor() {
        super();

    }

    static playPropName(prosName, resPath, sample, startPos, endPos, finishCallback) {
        cc.loader.loadRes(`${resPath}/${prosName}`, cc.SpriteAtlas, (err, atlas) => {

            if (err) {
                debug(err);
                return;
            }

            cc.loader.loadRes(`${resPath}/thumbs/${prosName}`, cc.SpriteFrame, (err, spriteFrame) => {

                if (err) {
                    debug(err);
                    return;
                }

                const animatingNode = new cc.Node();
                const animation = animatingNode.addComponent(cc.Animation);
                const sprite = animatingNode.addComponent(cc.Sprite);
                sprite.trim = false;
                sprite.spriteFrame = spriteFrame;

                animatingNode.position = startPos;

                cc.director.getScene().addChild(animatingNode);

                let moveToAction = cc.callFunc(() => null);

                if (endPos) {
                    moveToAction = cc.moveTo(0.6, endPos);
                }

                const seq = cc.sequence(moveToAction, cc.callFunc(() => {


                    var spriteFrames = atlas.getSpriteFrames();

                    var clip = cc.AnimationClip.createWithSpriteFrames(spriteFrames, sample);
                    clip.name = 'run';
                    clip.wrapMode = cc.WrapMode.Default;

                    animation.addClip(clip);
                    animation.play('run');

                    animation.on('finished', () => {
                        animatingNode.destroy();
                        animatingNode.removeFromParent(true);
                        finishCallback && finishCallback();
                    });
                }));

                animatingNode.runAction(seq);
            });

        });
    }
    static playPropAtIndex(propIndex, startNode, endNode) {
        const propName = props[propIndex];

        Props.playPropName(propName, 'props/', 10, startNode, endNode);
    }
}

app.createComponent(Props);