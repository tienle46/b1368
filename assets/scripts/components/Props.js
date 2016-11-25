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

    static playPropName(prosName,startNode,endNode, finishCallback){
        cc.loader.loadRes(`props/${prosName}`, cc.SpriteAtlas, (err, atlas) => {

            cc.loader.loadRes(`props/thumbs/${prosName}`, cc.SpriteFrame, (err, spriteFrame) => {

                const animatingNode = new cc.Node();
                const animation = animatingNode.addComponent(cc.Animation);
                const sprite = animatingNode.addComponent(cc.Sprite);
                sprite.trim = false;
                sprite.spriteFrame = spriteFrame;

                animatingNode.position = startNode.getPosition();
                startNode.parent.addChild(animatingNode);

                const moveToAction = cc.moveTo(0.7, endNode.getPosition());
                const seq = cc.sequence(moveToAction, cc.callFunc(()=>{


                    var spriteFrames = atlas.getSpriteFrames();

                    var clip = cc.AnimationClip.createWithSpriteFrames(spriteFrames, 8);
                    clip.name = 'run';
                    clip.wrapMode = cc.WrapMode.Default;

                    animation.addClip(clip);
                    animation.play('run');

                    animation.on('finished', ()=>{
                        animatingNode.removeFromParent();
                        finishCallback && finishCallback();
                    });
                }));

                animatingNode.runAction(seq);
            });

        });
    }
    static playPropAtIndex(propIndex, startNode,endNode){
        const propName = props[propIndex];

        Props.playPropName(propName, startNode, endNode);
    }
}

app.createComponent(Props);