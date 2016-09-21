import app from 'app'
import Component from 'Component'

export default class SliderControl extends Component {

    constructor() {
        super();
        this.minimumImage = cc.SpriteFrame;
        this.maximumImage = cc.SpriteFrame;
        this.trackSpriteFrame = cc.SpriteFrame;
        this.trackFilledSpriteFrame = cc.SpriteFrame;
        this.thumbImage = cc.SpriteFrame;
        this.minValue = {
            default : 0,
            type: cc.Float
        };
        this.maxValue = {
            default : 0,
            type: cc.Float
        };
        this.step = {
            default : 0,
            type: cc.Float
        };
    }

    onLoad () {

    }
}