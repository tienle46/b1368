import RubUtils from 'RubUtils';
import app from 'app';

export default class AudioManager {
    constructor() {
        this.audioSources = {};
        this._allowedExtensions = ['mp3']; 
        this._soundDirUrl = 'sounds'; // inside resources folder       
        this._initAudio();
        this._addGlobalStaticKeys();
        
        this.setMaxAudioInstance(50);
    }
    
    /**
     * @memberOf AudioManager
     */
    _addGlobalStaticKeys() {
        this.DANH_BAI = 'DanhBai'; // => DanhBai.mp3
        this.XOCDIA_MOVING_CHIPS = "XocdiaMovingChips"; // => xocdia/movingChips.mp3
    }
    
    add(url) {
        let regEx = new RegExp(`\/${this._soundDirUrl}\/\\s*([^\\n\\r]*)`);
        if(regEx.test(url)) {
            let path = regEx.exec(url)[1];
            regEx = new RegExp(`([A-Za-z0-9\/]+).(${this._allowedExtensions.join('|')})`);
            if(regEx.test(path)) {
                let key = regEx.exec(path)[1];
                key = key.split('/').map(string => `${string.charAt(0).toUpperCase()}${string.slice(1)}`).join("");
                
                if(!this.audioSources[key])
                    this.audioSources[key] = {url};
                
                // movingChip => MOVING_CHIP
                let keyUpperCase = `${key.charAt(0)}${key.slice(1).replace(/([A-Z])/g,($1) => `_${$1.toLowerCase()}`)}`.toUpperCase();
                    
                if(!this[keyUpperCase]) {
                    this[keyUpperCase] = key;
                }
            }
        }
    }
    
    /**
     * 
     *  
     * @param {string} name : Name of file which is inside 'sounds' folder, in UNDERSCORE_UPPERCASE format.
     *                      : Ex: BocBai => name = BOC_BAI, movingChips => name = MOVING_CHIPS 
     * @param {boolean} [isLoop=false] 
     * @param {number} [volume=0.5] 
     * 
     * @memberOf AudioManager
     */
    play(name, isLoop = false, volume = 0.5) {
        if(app.system.marker.getItemData(app.system.marker.SOUND_OPTION) && this.getClip(name)) {
            let audioId = cc.audioEngine.play(this.getURL(name), isLoop, volume);
            
            this.audioSources[name].id = audioId;
        }
    }
    
    getClip(name) {
        return this.audioSources[name];    
    }
    
    getId(name) {
        return this.getClip(name) && this.audioSources[name].id;    
    }
    
    getURL(name) {
        return this.getClip(name) && this.audioSources[name].url;    
    }
    
    setLoop(name, isLoop) {
        let id = this.getId(name);
        cc.audioEngine.setLoop(id, isLoop);
    }
    
    setVolume(name, volume) {
        let id = this.getId(name);
        cc.audioEngine.setVolume(id, volume);
    }
    
    pause(name) {
        let id = this.getId(name);
        cc.audioEngine.pause(id);
    }
    
    pauseAll() {
        cc.audioEngine.pauseAll();
    }
    
    resume(name) {
        let id = this.getId(name);
        cc.audioEngine.resume(id);
    }
    
    resumeAll() {
        cc.audioEngine.resumeAll();
    }
    
    stop(name) {
        let id = this.getId(name);
        cc.audioEngine.stop(id);
    }
    
    stopAll() {
        cc.audioEngine.stopAll();
    }
    
    // @param num {int} a number of instances to be created from within an audio
    setMaxAudioInstance(num) {
       cc.audioEngine.setMaxAudioInstance(num); 
    }
    
    getState(name) {
        let id = this.getId(name);
        return cc.audioEngine.getState(id);
    }
    
    isPlaying(name) {
        return this.getState(name) === cc.audioEngine.AudioState.PLAYING;
    }
    
    isInitalzing(name) {
        return this.getState(name) === cc.audioEngine.AudioState.INITIALZING;
    }
    
    isPaused(name) {
        return this.getState(name) === cc.audioEngine.AudioState.PAUSED;
    }
    
    _initAudio() {
        RubUtils.getAudioClipsFromResDir(this._soundDirUrl, (clips) => {
            clips && clips.forEach(rawUrl => {
                rawUrl && this.add(rawUrl);
            });
        });
    }
}