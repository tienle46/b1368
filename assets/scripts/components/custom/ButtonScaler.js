var Component = require('Component');
var app = require('app');

class ButtonScaler extends Component {
    constructor() {
        super();
        this.pressedScale = {
            default: 1.05,
            type: cc.Float
        };

        this.transDuration = {
            default: 0.08,
            type: cc.Float
        };
    }

    onLoad() {
        super.onLoad();
        var self = this;
        var audioMng = cc.find('Menu/AudioMng') || cc.find('Game/AudioMng');
        if (audioMng) {
            audioMng = audioMng.getComponent('AudioMng');
        }
        this.initScale = this.node.scale;
        this.button = this.getComponent(cc.Button);

        this.scaleUpAction = cc.scaleTo(this.transDuration, this.pressedScale);
        this.scaleDownAction = cc.scaleTo(this.transDuration, this.initScale);

        function onTouchDown(e) {
            this.stopAllActions();
            if (audioMng) audioMng.playButton();
            this.runAction(self.scaleUpAction);
        }

        function onTouchUp(e) {
            this.stopAllActions();
            this.runAction(self.scaleDownAction);
        }
        this.node.on('touchstart', onTouchDown, this.node);
        this.node.on('touchend', onTouchUp, this.node);
        this.node.on('touchcancel', onTouchUp, this.node);
    }
}

app.createComponent(ButtonScaler);