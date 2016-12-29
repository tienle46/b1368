import app from 'app';
import Component from 'Component';
import GridViewRub from 'GridViewRub';

export default class TabUserAchievements extends Component {
    constructor() {
        super();
        this.bodyNode = {
            default: null,
            type: cc.Node
        };
    }

    onLoad() {
        this._getAchievementsDataFromServer();
    }

    _getAchievementsDataFromServer() {
        let sendObj = {
            cmd: app.commands.USER_ACHIEVEMENT
        };

        app.service.send(sendObj, (res) => {
            if (res) {
                let gameListCol = res[app.keywords.GAME_NAME_LIST] || [];
                let levelCol = res[app.keywords.LEVEL_LIST].map((e) => `Cấp độ ${e}`) || [];
                // let levelCol = res[app.keywords.LEVEL_TITLE_LIST]|| [];
                let winCol = res[app.keywords.WIN_LIST] || [];
                let loseCol = res[app.keywords.LOST_LIST] || [];

                let data = [
                    gameListCol,
                    levelCol,
                    winCol,
                    loseCol
                ];

                let head = {
                    data: ['Tên Game', 'Cấp độ', 'Thắng', 'Thua'],
                    options: {
                        fontColor: app.const.COLOR_YELLOW,
                        fontSize: 25
                    }
                };

                let achievementsTab = new GridViewRub(head, data, {
                    group: {
                        colors: [new cc.Color(244, 228, 154), null, app.const.COLOR_YELLOW, app.const.COLOR_GRAY]
                    }
                });

                this.bodyNode.addChild(achievementsTab.getNode());
            }
        });
    }
}

app.createComponent(TabUserAchievements);