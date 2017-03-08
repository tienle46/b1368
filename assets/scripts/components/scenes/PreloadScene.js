import app from 'app';
import Component from 'Component';
import BuddyManager from 'BuddyManager';
import PhomGenerator from 'PhomGenerator';
import Card from 'Card';

class PreloadScene extends Component {
    constructor() {
        super();

        this.loading = {
            default: null,
            type: cc.Node
        }
        this.asss = "asdadas";
    }

    onLoad() {
        if (this.loading) {
            this.loading.getComponent('FullSceneProgress').show(app.res.string('loading_data'));
        }

        this._setupEnvironment();

        let cards = [
            Card.from(Card.RANK_AT, Card.SUIT_ZO),
            Card.from(Card.RANK_HAI, Card.SUIT_ZO),
            Card.from(Card.RANK_BA, Card.SUIT_ZO),
            Card.from(Card.RANK_BON, Card.SUIT_BICH),
            Card.from(Card.RANK_NAM, Card.SUIT_ZO),
            Card.from(Card.RANK_SAU, Card.SUIT_TEP),
            Card.from(Card.RANK_BAY, Card.SUIT_ZO),
            Card.from(Card.RANK_TAM, Card.SUIT_BICH),
            Card.from(Card.RANK_CHIN, Card.SUIT_ZO),
            Card.from(Card.RANK_Q, Card.SUIT_ZO)
        ]

        cards[0].setLocked(true);

        PhomGenerator.generatePhomContainEatenCards(cards, [Card.from(Card.RANK_AT, Card.SUIT_ZO)])
    }

    _setupEnvironment() {

        if (app.env.isBrowser()) {
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
            { dir: 'popup/MultiTabPopup', name: 'multiTabPopup' },
            { dir: 'common/FullSceneProgress', name: 'fullSceneLoading' },
            { dir: 'popup/MessagePopup', name: 'messagePopup' },
            { dir: 'popup/ConfirmPopup', name: 'confirmPopup' },
            { dir: 'popup/PromptPopup', name: 'promptPopup' },
            { dir: 'popup/SingleLinePromptPopup', name: 'singleLinePromptPopup' },
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

        // app.async.parallel([
        //     () => (callback) => {
        //         cc.loader.loadRes("", (err, prefab) => {
        //             app.res.spriteFrame[res.name] = prefab;
        //             prefab ? callback(null, true) : callback();
        //         });
        //     }
        // ], (error, results) => {
        //
        // })
    }

    onLoadResourceDone() {
        let frameSize = cc.view.getFrameSize(); // 1280x720
        cc.view.setDesignResolutionSize(frameSize.width, frameSize.height, cc.ResolutionPolicy.EXACT_FIT);
        app.system.loadScene(app.const.scene.ENTRANCE_SCENE);
    }
}

app.createComponent(PreloadScene);