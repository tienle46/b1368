import app from 'app';
import Component from 'Component';

class AudioManager extends Component {
    constructor() {
        super();
        this.bgm = {
            default: null,
            url: cc.AudioClip
        };

        this.defaultVolume = 0.5;

        this.audioId = null;
    }

    onLoad() {
        // this.bgm && this.playMusic(this.bgm, this.defaultVolume);
    }


    playMusic(clip, volume) {
        this.audioId = cc.audioEngine.play(clip, true);
        this.setVolume(this.audioId, volume);
    }

    setVolume(id, volume) {
        // cc.audioEngine.setVolume(id, volume);
    }
}

app.createComponent(AudioManager);