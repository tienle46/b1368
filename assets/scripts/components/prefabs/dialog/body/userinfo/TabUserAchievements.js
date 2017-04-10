import app from 'app';
import PopupTabBody from 'PopupTabBody';
import { isNull } from 'Utils';

export default class TabUserAchievements extends PopupTabBody {
    constructor() {
        super();
        this.p404 = {
            default: null,
            type: cc.Node
        };
    }

    loadData() {
        if(Object.keys(this._data).length > 0)
            return false;
        super.loadData();
        
        this._getAchievementsDataFromServer();
        return true;
    }
    
    onDataChanged(data) {
        data && Object.keys(data).length > 0 && this._renderUserAchievements(data);
    }
    
    _addGlobalListener() {
        super._addGlobalListener();
        app.system.addListener(app.commands.USER_ACHIEVEMENT, this._onUserAchievement, this);
    }

    _removeGlobalListener() {
        super._removeGlobalListener();
        app.system.removeListener(app.commands.USER_ACHIEVEMENT, this._onUserAchievement, this);
    }

    _getAchievementsDataFromServer() {
        let sendObj = {
            cmd: app.commands.USER_ACHIEVEMENT
        };
        
        this.showLoadingProgress();
        app.service.send(sendObj);
    }

    _onUserAchievement(res) {
        this.setLoadedData(res);
    }
    
    _renderUserAchievements(res){
        let gameCodeList = res[app.keywords.GAME_CODE_LIST] || [];
        if (gameCodeList.length > 0) {
            let levelCol = res[app.keywords.LEVEL_LIST].map((e) => `Cấp độ ${e}`) || [];
            // let levelCol = res[app.keywords.LEVEL_TITLE_LIST]|| [];
            let winCol = res[app.keywords.WIN_LIST] || [];
            let loseCol = res[app.keywords.LOST_LIST] || [];
            let gameListCol = res[app.keywords.GAME_NAME_LIST] || [];

            let data = [
                gameListCol.map(e => e),
                levelCol.map(e => e),
                winCol.map(e => isNull(e) ? '0' : e.toString()),
                loseCol.map(e => isNull(e) ? '0' : e.toString())
            ];

            let head = {
                options: {
                    fontColor: app.const.COLOR_YELLOW
                }
            };

            this.initView(head, data, {
                size: this.bodyNode.getContentSize(),
                group: {
                    colors: [new cc.Color(244, 228, 154), null, app.const.COLOR_YELLOW, app.const.COLOR_GRAY]
                }
            });

            this.bodyNode.addChild(this.getScrollViewNode());
        } else {
            this.showEmptyPage(this.p404);
        }
    }
    
}

app.createComponent(TabUserAchievements);