import app from 'app';
import Component from 'Component';
import EntranceScene from 'EntranceScene';
import FullSceneProgress from 'FullSceneProgress';

class PreloadScene extends Component {
    constructor() {
        super();

        this.fullSceneLoadingPrefab = {
            default : null,
            type : cc.Prefab
        };
        this.loadingPrefab = {
            default : null,
            type : cc.Prefab
        };
        this.loading = {
            default: null,
            type: cc.Node
        };
    }

    onLoad() {
        app.res.prefab.loading = this.loadingPrefab;
        app.res.prefab.fullSceneLoading = this.fullSceneLoadingPrefab;
        if(this.loading){
            debug(this.loading);
            this.loading.getComponent(FullSceneProgress.name).show(app.res.string('loading_data'));
        }
        else{
            debug(`what the heck?`);
        }
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
            results.some((success)=>{
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
        app.system.loadScene(EntranceScene.name);
    }
}

app.createComponent(PreloadScene);