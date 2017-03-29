import app from 'app';
import PopupTabBody from 'PopupTabBody';
import RubUtils from 'RubUtils';
import { setOpacity } from 'Utils';

class TabTopCaoThu extends PopupTabBody {
    constructor() {
        super();

        this.properties = {
            ...this.properties,
            gamePicker: cc.Node,
            contentNode: cc.Node,
            crownsNode: cc.Node,
            gameItem: cc.Node,
            backGroundSprite: cc.Sprite
        }

        this.currentGameCode = null;
        this.itemLoaded = null;
        this.activateToggle = null;
    }
    
    onLoad() {
        super.onLoad();
    }
    
    loadData() {
        if(Object.keys(this._data).length > 0)
            return false;
        super.loadData();
        
        this._initGamesToggle();
        return true;
    }
    
    onDataChanged({usernames = [], wons, gc} = {}) {
        usernames && usernames.length > 0 && this._renderGridFromUsernames(usernames, wons, gc);
    }

    _addGlobalListener() {
        super._addGlobalListener();
        app.system.addListener(app.commands.GET_TOP_PLAYERS, this._onGetTopPlayers, this);
    }

    _removeGlobalListener() {
        super._removeGlobalListener();
        app.system.removeListener(app.commands.GET_TOP_PLAYERS, this._onGetTopPlayers, this);
    }
    
    _initGamesToggle() {
        let count = 0;
        app.config.supportedGames.length > 0 && app.async.mapSeries(app.config.supportedGames, (gameCode, cb) => {
            let gameIconPath = app.res.gameIcon[gameCode];

            gameIconPath && RubUtils.getSpriteFrameFromAtlas('blueTheme/atlas/game_icons', gameIconPath, (sprite) => {
                this.backGroundSprite.spriteFrame = sprite;
                let node = cc.instantiate(this.gameItem);
                let toggle = node.getComponent(cc.Toggle);
                toggle.isChecked = count === 0;

                node._gameCode = gameCode;
                node.active = true;

                if (toggle.isChecked) {
                    this.activateToggleNode = node;
                    this.itemLoaded = true;

                    setOpacity(this.activateToggleNode, 255);

                    // this.previousGameCode = gameCode;

                    this._requestDataFromServer(gameCode, 1);
                }

                this.gamePicker.addChild(node);

                count++;

                cb();
            });
        });
    }
    
    _requestDataFromServer(gameCode, page) {
        this.currentGameCode = gameCode;

        let sendObject = {
            'cmd': app.commands.GET_TOP_PLAYERS,
            'data': {
                [app.keywords.GAME_CODE]: gameCode
            }
        };
        
        this.showLoadingProgress();
        app.service.send(sendObject);
    }

    onGameItemClicked(toggle) {
        setOpacity(this.activateToggleNode, 100);
        this.activateToggleNode = toggle.node;
        setOpacity(this.activateToggleNode, 255);

        // this.previousGameCode = this.currentGameCode;
        let _gameCode = toggle.node._gameCode;
        this.currentGameCode = _gameCode;
        this._requestDataFromServer(this.currentGameCode, 1);
    }

    _onGetTopPlayers(data) {
        this.setLoadedData(data);
    }
    
    _renderGridFromUsernames(usernames, wons, gc) {
        let count = 0;
        
        let d = [
            (usernames || []).map((status, index) => {
                let order = index + 1;
                if (this.crownsNode.children[index] && order <= 3)
                    return cc.instantiate(this.crownsNode.children[index]);
                else
                    return `${order}`;
            }),
            (usernames || []),
            wons,
        ];
        
        // let isNew = gc != this.previousGameCode;
        // this.previousGameCode = gc;
        this._initBody(d);
    }
    
    _initBody(d) {
        // let next = this.onNextBtnClick;
        // let prev = this.onPreviousBtnClick;

        this.initView({
            data: ['STT', 'Tài khoản', 'Thắng'],
            options: {
                fontColor: app.const.COLOR_YELLOW
            }
        }, d, {
            // paging: { next, prev, context: this },
            size: this.contentNode.getContentSize(),
            // isNew,
            group: {
                widths: ['', 350, ''],
                colors: ['', '', new cc.Color(255, 214, 0)]
            }
        });
        this.contentNode.addChild(this.getScrollViewNode());
    }

    onPreviousBtnClick(page) {
        this._requestDataFromServer(this.currentGameCode, page);
    }

    onNextBtnClick(page) {
        this._requestDataFromServer(this.currentGameCode, page);
    }
}

app.createComponent(TabTopCaoThu);