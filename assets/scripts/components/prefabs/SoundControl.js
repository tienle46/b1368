import app from 'app';
import Component from 'Component';

class SoundControl extends Component {
    constructor() {
        super();
        this.defaultValue = 0.5;
        this.slider = {
            default: null,
            type: cc.Node
        };

        this.closeBtn = {
            default: null,
            type: cc.Button
        };
    }

    onLoad() {
        this.progressBarComponent = this.slider.getComponent(cc.ProgressBar);
        this.sliderComponent = this.slider.getComponent(cc.Slider);
        this.hide();
    }

    onSliderChange(e) {
        let value = e.progress;
        this.progressBarComponent.progress = value;

        let audioManager = this.node.getComponent('AudioManager');
        audioManager.setVolume(audioManager.audioId, value);

        if (value === 0) {
            cc.audioEngine.pause(audioManager.audioId);
        } else {
            cc.audioEngine.resume(audioManager.audioId);
        }
    }

    onCloseBtnClick() {
        // hide
        this.hide();
    }

    show() {
        this.node.opacity = 255;
    }

    hide() {
        this.node.opacity = 0;
    }
}

app.createComponent(SoundControl);