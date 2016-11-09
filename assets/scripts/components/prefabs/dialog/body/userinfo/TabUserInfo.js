import app from 'app';
import Component from 'Component';
import LoaderRub from 'LoaderRub';
import numeral from 'numeral';
import GridViewRub from 'GridViewRub';
import _ from 'lodash';

export default class TabUserInfo extends Component {
    constructor() {
        super();
        this.userName = {
            default: null,
            type: cc.RichText,
        };
        this.vipLevel = {
            default: null,
            type: cc.RichText,
        };
        this.chipAmout = {
            default: null,
            type: cc.RichText,
        };
        this.verifiedStatus = {
            default: null,
            type: cc.RichText,
        };
        this.statisticPanel = {
            default: null,
            type: cc.Node,
        };
    }

    onLoad() {
        // spin loader
        this.loader = new LoaderRub(this.node.parent.parent);
        this.loader.show();

        this._initUserData((userData) => {
            this._fillData(userData);
        });
    }

    _initUserData(cb) {
        let data = {};
        data[app.keywords.USER_NAME] = app.context.getMyInfo().name;

        let sendObj = {
            cmd: app.commands.USER_PROFILE,
            data
        };

        app.service.send(sendObj, (data) => {
            if (data) {
                cb(data);
                this.loader.hide();
            }
        });
    }

    _fillData(userData) {

        // console.log(userData);

        this.userName.string = `<color = ${app.const.HX_COLOR_WHITE}>Tên: </color><color = ${app.const.HX_COLOR_YELLOW}>${app.context.getMyInfo().name}</color>`;
        this.chipAmout.string = `<color = ${app.const.HX_COLOR_WHITE}>Chip: </color><color = ${app.const.HX_COLOR_YELLOW}>${numeral(app.context.getMyInfo().coin).format('0,0')}</color>`;


        this.vipLevel.string = `<color = ${app.const.HX_COLOR_WHITE}>Cấp độ: </color><color = ${app.const.HX_COLOR_YELLOW}>Tỉ phú</color>`;

        if (app.context.needUpdatePhoneNumber()) {
            this.verifiedStatus.string = `<color = ${app.const.HX_COLOR_WHITE}>Phone: </color><color = ${app.const.HX_COLOR_YELLOW}>Chưa cập nhật</color>`;
        } else {
            this.verifiedStatus.string = `<color = ${app.const.HX_COLOR_WHITE}>Phone: </color><color = ${app.const.HX_COLOR_YELLOW}>${userData.p}</color>`;
        }

        this._initAchievementsTab();
    }

    _initAchievementsTab() {
        let achievementsTab = new GridViewRub(null, [
            ['x', 'x1', 'x2'],
            ['z', 'z1', 'z2'],
            ['y', 'y1', 'y2']
        ], {
            position: cc.v2(2, 140),
            width: 600,
            height: 240,
            spacingX: 0,
            spacingY: 0,
            cell: {
                horizontalSeparate: {
                    pattern: new cc.Color(102, 45, 145)
                }
            },
            group: {
                colors: [null, app.const.COLOR_YELLOW, null]
            }
        });

        this._getAchievementsDataFromServer((data) => {
            achievementsTab.resetData(data);

            achievementsTab.getNode().then((prefab) => {
                this.statisticPanel.addChild(prefab);

                // const widget = prefab.addComponent(cc.Widget);
                // widget.isAlignLeft = true;
                // widget.isAlignRight = true;
                // widget.isAlignTop = true;
                // widget.isAlignBottom = true;
                //
                // widget.left = 0;
                // widget.right = 0;
                // widget.top = 0
                // widget.bottom = 0;
            });
        });

    }

    _getAchievementsDataFromServer(cb) {
        let sendObj = {
            cmd: app.commands.USER_ACHIEVEMENT
        };
        app.service.send(sendObj, (res) => {
            if (res) {
                let gameListCol = res[app.keywords.GAME_NAME_LIST] || [];
                let levelCol = res[app.keywords.LEVEL_LIST].map((e) => `Cấp độ ${e}`) || [];
                // let levelCol = res[app.keywords.LEVEL_TITLE_LIST]|| [];
                let winLostCol = res[app.keywords.WIN_LIST].map((e, i) => `${e}/${res[app.keywords.LOST_LIST][i]}`) || [];

                let data = [
                    gameListCol,
                    levelCol,
                    winLostCol,
                ];

                cb(_.cloneDeep(data));
            }

        });
    }
}

app.createComponent(TabUserInfo);