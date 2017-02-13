import app from 'app';
import Component from 'Component';

class PreloadScene extends Component {
    constructor() {
        super();

        this.fullSceneLoadingPrefab = {
            default: null,
            type: cc.Prefab
        };
        this.loadingPrefab = {
            default: null,
            type: cc.Prefab
        };
        this.loading = {
            default: null,
            type: cc.Node
        };
    }

    onLoad() {
        app.res.prefab.loading = this.loadingPrefab;
        app.res.prefab.fullSceneLoading = this.fullSceneLoadingPrefab;
        if (this.loading) {
            debug(this.loading);
            this.loading.getComponent('FullSceneProgress').show(app.res.string('loading_data'));
        } else {
            debug(`what the heck?`);
        }

        this._setupEnvironment();
    }

    _setupEnvironment() {
        if (cc.sys.isBrowser) {
            cc.game.pause = () => {};
            cc.game.setFrameRate(48);
        }

        cc.game.on(cc.game.EVENT_HIDE, function() {
            app.system.isInactive = true;
        });

        cc.game.on(cc.game.EVENT_SHOW, function() {
            app.system.isInactive = false;
        });
    }

    onEnable() {
        let resources = [
            { dir: 'toast/Toast', name: 'toast' },
            { dir: 'dashboard/grid/scrollview', name: 'scrollview' },
            { dir: 'popup/FriendProfilePopup', name: 'friendProfilePopup' },
            { dir: 'dashboard/dialog/prefabs/dialog', name: 'dialog' },
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

            console.log("results: ", results);

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