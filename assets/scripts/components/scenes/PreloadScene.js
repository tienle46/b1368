import app from 'app';
import Component from 'Component';
import AudioManager from 'AudioManager';
import NotificationMessage from 'NotificationMessage';

class PreloadScene extends Component {
    constructor() {
        super();

        this.loading = {
            default: null,
            type: cc.Node
        }
    }

    onLoad() {
        super.onLoad()

        if (this.loading) {
            this.loading.getComponent('FullSceneProgress').show(app.res.string('loading_data'));
        }
        let IAPManager = require('IAPManager'); 
        app.iap = new IAPManager();
        app.iap.init();

        // tai xiu treo
        let TaiXiuTreoManager = require('TaiXiuTreoManager')
        app.taiXiuTreoManager = new TaiXiuTreoManager()

        // Minigames icon
        let MiniGamesManager = require('MiniGamesManager');
        app.minigameManager = new MiniGamesManager();

        // visibility
        
        let VisibilityManager = require('VisibilityManager')
        app.visibilityManager = new VisibilityManager(app.config.features);

        app.system.initOnFirstSceneLoaded()
        
        this._customCocosEngine();
        
        // let cards = [
        //     Card.from(Card.RANK_AT, Card.SUIT_ZO),
        //     Card.from(Card.RANK_HAI, Card.SUIT_ZO),
        //     Card.from(Card.RANK_BA, Card.SUIT_ZO),
        //     Card.from(Card.RANK_BON, Card.SUIT_BICH),
        //     Card.from(Card.RANK_NAM, Card.SUIT_ZO),
        //     Card.from(Card.RANK_SAU, Card.SUIT_TEP),
        //     Card.from(Card.RANK_BAY, Card.SUIT_ZO),
        //     Card.from(Card.RANK_TAM, Card.SUIT_BICH),
        //     Card.from(Card.RANK_CHIN, Card.SUIT_ZO),
        //     Card.from(Card.RANK_Q, Card.SUIT_ZO)
        // ];
        //
        // cards[0].setLocked(true);
        //
        // PhomGenerator.generatePhomContainEatenCards(cards, [Card.from(Card.RANK_AT, Card.SUIT_ZO)]);
    }

    onEnable() {

        let resources = [
            { dir: 'toast/Toast', name: 'toast' },
            { dir: 'dashboard/dialog/prefabs/verification_dialog', name: 'verificationDialog' },
            { dir: 'components/Notification', name: 'notification' },
            { dir: 'dashboard/grid/scrollview', name: 'scrollview' },
            { dir: 'jar/jarPrefab', name: 'jarPrefab' },
            { dir: 'jar/jar_explosion', name: 'jarExplosive' },
            { dir: 'popup/FriendProfilePopup', name: 'friendProfilePopup' },
            { dir: 'dashboard/dialog/prefabs/dialog', name: 'dialog' },
            { dir: 'dashboard/dialog/prefabs/event/EventDialog', name: 'eventDialog' },
            { dir: 'dashboard/dialog/prefabs/WebviewDialog', name: 'webviewDialog' },
            { dir: 'popup/MultiTabPopup', name: 'multiTabPopup' },
            { dir: 'common/FullSceneProgress', name: 'fullSceneLoading' },
            { dir: 'popup/MessagePopup', name: 'messagePopup' },
            { dir: 'popup/ConfirmPopup', name: 'confirmPopup' },
            { dir: 'popup/PromptPopup', name: 'promptPopup' },
            { dir: 'popup/SingleLinePromptPopup', name: 'singleLinePromptPopup' },
            { dir: 'taixiuTreo/HungSicBoPrefab', name: 'hungSicBo' },
            { dir: 'MinigameIcon/MiniGameIcon', name: 'minigameIcon'},
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
        
        app.system.audioManager = new AudioManager();
        app.system.notify = new NotificationMessage();
    }

    onLoadResourceDone() {
        let frameSize = cc.view.getFrameSize(); // 1280x720
        cc.view.setDesignResolutionSize(frameSize.width, frameSize.height, cc.ResolutionPolicy.EXACT_FIT);
        app.system.loadScene(app.const.scene.ENTRANCE_SCENE);
        
        // cc.view.enableAntiAlias(false);
    }

    /**
     * Modifying cocos's source
     * @memberof PreloadScene
     */
    _customCocosEngine() {
        // TextUtils
        let unicode = `ÁÀÃẠẢĂẮẰẴẶẲÂẤẦẪẬẨĐÉÈẼẸẺÊẾỀỄỆỂÔỐỒỖỘỔƠỚỜỠỢỞÒÓỌỎÕÍÌĨỊỈÝỲỸỴỶÚÙŨỤỦƯỨỪỮỰỬáàãạảăắằẵặẳâấầẫậẩđéèẽẹẻêếềễệểôốồỗộổơớờỡợởòóọỏõíìĩịỉýỳỹỵỷúùũụủưứừữựử`
        cc.TextUtils.label_lastWordRex = new RegExp(`([a-zA-Z0-9ÄÖÜäöüßéèçàùêâîôûа-яА-ЯЁё${unicode}]+\|\\S)$`);
        cc.TextUtils.label_lastEnglish = new RegExp(`[a-zA-Z0-9ÄÖÜäöüßéèçàùêâîôûа-яА-ЯЁё${unicode}]+$`);
        cc.TextUtils.label_firsrEnglish = new RegExp(`^[a-zA-Z0-9ÄÖÜäöüßéèçàùêâîôûа-яА-ЯЁё${unicode}]`);
    }
}

app.createComponent(PreloadScene);