var Component = require('Component');
var app = require('app');

class AudioMng extends Component {
    constructor() {
        super();

        this.winAudio = {
            default: null,
            url: cc.AudioClip
        };

        this.loseAudio = {
            default: null,
            url: cc.AudioClip
        };

        this.cardAudio = {
            default: null,
            url: cc.AudioClip
        };

        this.buttonAudio = {
            default: null,
            url: cc.AudioClip
        };

        this.chipsAudio = {
            default: null,
            url: cc.AudioClip
        };

        this.bgm = {
            default: null,
            url: cc.AudioClip
        };
    }

    playMusic() {
        cc.audioEngine.playMusic(this.bgm, true);
    }

    pauseMusic() {
        cc.audioEngine.pauseMusic();
    }

    resumeMusic() {
        cc.audioEngine.resumeMusic();
    }

    _playSFX(clip) {
        cc.audioEngine.playEffect(clip, false);
    }

    playWin() {
        this._playSFX(this.winAudio);
    }

    playLose() {
        this._playSFX(this.loseAudio);
    }

    playCard() {
        this._playSFX(this.cardAudio);
    }

    playChips() {
        this._playSFX(this.chipsAudio);
    }

    playButton() {
        this._playSFX(this.buttonAudio);
    }
}

// app.createComponent(AudioMng);