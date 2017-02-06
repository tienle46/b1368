import app from 'app';
import DialogActor from 'DialogActor';
import { isNull } from 'Utils';

export default class TabUserAchievements extends DialogActor {
    constructor() {
        super();
        this.bodyNode = {
            default: null,
            type: cc.Node
        };
    }

    start() {
        super.start();
        this._getAchievementsDataFromServer();
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

        this.showLoader(this.bodyNode);
        app.service.send(sendObj);
    }

    _onUserAchievement(res) {
        let gameListCol = res[app.keywords.GAME_NAME_LIST] || [];
        if (gameListCol.length > 0) {
            let levelCol = res[app.keywords.LEVEL_LIST].map((e) => `Cấp độ ${e}`) || [];
            // let levelCol = res[app.keywords.LEVEL_TITLE_LIST]|| [];
            let winCol = res[app.keywords.WIN_LIST] || [];
            let loseCol = res[app.keywords.LOST_LIST] || [];

            let data = [
                gameListCol,
                levelCol,
                winCol.map(e => isNull(e) ? '0' : e.toString()),
                loseCol.map(e => isNull(e) ? '0' : e.toString())
            ];

            let head = {
                data: ['Tên Game', 'Cấp độ', 'Thắng', 'Thua'],
                options: {
                    fontColor: app.const.COLOR_YELLOW,
                    fontSize: 25
                }
            };

            this.initView(head, data, {
                size: this.bodyNode.getContentSize(),
                group: {
                    colors: [new cc.Color(244, 228, 154), null, app.const.COLOR_YELLOW, app.const.COLOR_GRAY]
                }
            });

            this.bodyNode.addChild(this.getScrollViewNode());
            this.hideLoader(this.bodyNode);
        } else {
            this.pageIsEmpty(this.bodyNode);
        }
    }
}

app.createComponent(TabUserAchievements);