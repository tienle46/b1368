import app from 'app';
import Component from 'Component';
import EntranceScene from 'EntranceScene';
import FullSceneProgress from 'FullSceneProgress';

class PreloadScene extends Component {
    constructor() {
        super();

        this.fullSceneLoadingPrefab = cc.Prefab;
        this.loadingPrefab = cc.Prefab;
        this.loading = cc.Node;
    }

    onLoad() {
        app.res.prefab.loading = this.loadingPrefab;
        app.res.prefab.fullSceneLoading = this.fullSceneLoadingPrefab;
        this.loading.getComponent(FullSceneProgress.name).show(app.res.string('loading_data'));
    }

    onEnable() {
        app.async.parallel([
            (callback) => {
                cc.loader.loadRes('toast/Toast', (err, prefab) => {
                    app.res.prefab.toast = prefab;
                    prefab ? callback(null, true) : callback();
                });
            },
        ], (err, results) => {

            let loadedRes = true;
            for (let success of results) {
                if (!success) {
                    loadedRes = false;
                    break;
                }
            }

            if (loadedRes) {
                this.onLoadResourceDone();
            } else {
                app.system.error(app.res.string('error_cannot_load_data'));
            }
        });
    }

    onLoadResourceDone() {
        app.system.loadScene(EntranceScene.name);
    }
}

app.createComponent(PreloadScene);