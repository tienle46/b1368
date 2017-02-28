import app from 'app';
import Component from 'Component';
import BuddyManager from 'BuddyManager';
import Service from 'Service';

class PreloadScene extends Component {
    constructor() {
        super();

        this.loading = {
            default: null,
            type: cc.Node
        };
    }

    onLoad() {
        if (this.loading) {
            this.loading.getComponent('FullSceneProgress').show(app.res.string('loading_data'));
        }

        this._setupEnvironment();
    }

    _setupEnvironment() {

        if (app.env.isBrowser()) {
            cc.game.pause = () => {};
            cc.game.setFrameRate(48);
        }

        cc.game.on(cc.game.EVENT_HIDE, function() {
            app.system.isInactive = true;
            console.warn('cc.game.EVENT_HIDE', new Date().toISOString());
        });

        cc.game.on(cc.game.EVENT_SHOW, function() {
            app.system.isInactive = false;
            console.warn('cc.game.EVENT_SHOW', new Date().toISOString());
        });
    }

    onEnable() {
        let resources = [
            { dir: 'toast/Toast', name: 'toast' },
            { dir: 'dashboard/grid/scrollview', name: 'scrollview' },
            { dir: 'popup/FriendProfilePopup', name: 'friendProfilePopup' },
            { dir: 'dashboard/dialog/prefabs/dialog', name: 'dialog' },
            { dir: 'popup/MultiTabPopup', name: 'multiTabPopup' },
            { dir: 'common/FullSceneProgress', name: 'fullSceneLoading' },
            { dir: 'popup/MessagePopup', name: 'messagePopup' },
            { dir: 'popup/ConfirmPopup', name: 'confirmPopup' },
        ];

        app.async.parallel(resources.map((res) => {
            return (callback) => {
                cc.loader.loadRes(res.dir, res.type || cc.Prefab, (err, prefab) => {
                    app.res.prefab[res.name] = prefab;
                    prefab ? callback(null, true) : callback();
                });
            };
        }), (err, results) => {
            let loadedRes = true;
            results.some((success) => {
                if (!success) {
                    loadedRes = false;
                    return true;
                }
            });

            if (loadedRes) {
                this.onLoadResourceDone();
            } else {
                app.system.error(app.res.string('error_cannot_load_data'));
            }
        });
    }

    onLoadResourceDone() {
        let frameSize = cc.view.getFrameSize(); // 1280x720
        cc.view.setDesignResolutionSize(frameSize.width, frameSize.height, cc.ResolutionPolicy.EXACT_FIT);
        app.system.loadScene(app.const.scene.ENTRANCE_SCENE);
    }
}

app.createComponent(PreloadScene);