import app from 'app';
import Component from 'Component';

class BowlDishControl extends Component {
    constructor() {
        super();

        this.wrapper = {
            default: null,
            type: cc.Node
        };

        this.bowlNode = {
            default: null,
            type: cc.Node
        };


    }

    onLoad() {
        this.bowlPos = this.bowlNode.getPosition();

    }

    onTest() {
        let startPos = this.wrapper.getPosition();
        let goPos = cc.v2(startPos.x, startPos.y - 50);

        let bowlPos = this.bowlPos;

        this.bowlNode.setPosition(this.bowlPos);

        let sequence = cc.sequence(cc.fadeOut(0.1).clone(), cc.scaleTo(0.2, 2), cc.moveTo(0.1, goPos).clone(), cc.fadeIn(0.5).clone(), cc.callFunc(() => {
            let clip = this.node.getComponent(cc.Animation);
            clip.play(clip.getClips()[0].name);

            let counter = 0;
            clip.on('finished', () => {
                counter++;
                counter < 6 && clip.play(clip.getClips()[0].name);
                if (counter >= 6) {
                    counter = 0;
                    this.wrapper.runAction(cc.sequence(cc.fadeOut(0.1).clone(), cc.moveTo(0.1, startPos).clone(), cc.scaleTo(0.2, 1), cc.fadeIn(0.1).clone(), cc.callFunc(() => {
                        this.bowlNode.runAction(cc.sequence(cc.moveTo(1, cc.v2(bowlPos.x - 2 / 3 * this.bowlNode.getContentSize().width, bowlPos.y)), cc.callFunc(() => {
                            this.bowlPos = bowlPos;
                        })));
                    })));
                }
            });
        }));
        this.wrapper.runAction(sequence);
    }
}

app.createComponent(BowlDishControl);