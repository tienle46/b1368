var Component = require('Component');
var app = require('app');

class ButtonScaler extends Component {
    constructor() {
        super();
        this.pressedScale = 0.85;
        this.transDuration = 0.1;
    }

    onLoad() {
        var self = this;
        var audioMng = cc.find('Menu/AudioMng') || cc.find('Game/AudioMng');
        if (audioMng) {
            audioMng = audioMng.getComponent('AudioMng');
        }
        this.initScale = this.node.scale;
        this.button = this.getComponent(cc.Button);

        this.scaleDownAction = cc.scaleTo(this.transDuration, this.pressedScale);
        this.scaleUpAction = cc.scaleTo(this.transDuration, this.initScale);

        function onTouchDown(e) {
            this.stopAllActions();
            if (audioMng) audioMng.playButton();
            this.runAction(self.scaleDownAction);
        }

        function onTouchUp(e) {
            this.stopAllActions();
            this.runAction(self.scaleUpAction);
        }
        this.node.on('touchstart', onTouchDown, this.node);
        this.node.on('touchend', onTouchUp, this.node);
        this.node.on('touchcancel', onTouchUp, this.node);
    }
}

app.createComponent(ButtonScaler);