import app from 'app';
import Component from 'Component';
import GridViewRub from 'GridViewRub';
import numeral from 'numeral';
import RubUtils from 'RubUtils';
import LoaderRub from 'LoaderRub';

class TabTopDaiGia extends Component {
    constructor() {
        super();

        this.flag = null;
        this.topNodeId = 8;
        this.currentPage = 1;

        this.contentNode = {
            default: null,
            type: cc.Node
        };
        this.top1Sprite = {
            default: null,
            type: cc.Sprite
        };

        this.top1Name = {
            default: null,
            type: cc.Label
        };

        this.gridViewRub = null;
    }

    onLoad() {
        this.loader = new LoaderRub(this.node);

        let head = {
            data: ['STT', 'Tài khoản', 'Chips'],
            options: {
                fontColor: app.const.COLOR_YELLOW
            }
        };

        let next = this.onNextBtnClick.bind(this);
        let prev = this.onPreviousBtnClick.bind(this);

        let rubOptions = {
            paging: { prev, next },
            width: 670,
            height: 356,
            group: { widths: [90, 280, 280] }
        };

        this.gridViewRub = new GridViewRub(head, [], rubOptions);

        // show loader
        this.loader.show();

        this._initItems(this.currentPage);
    }

    _initItems(page) {
        this._getDataFromServer(page, (data) => {
            this._initBody(data);
        });
    }

    _getDataFromServer(page, cb) {
        let sendObject = {
            'cmd': app.commands.RANK_GROUP,
            'data': {
                [app.keywords.RANK_GROUP_TYPE]: app.const.DYNAMIC_GROUP_LEADER_BOARD,
                [app.keywords.RANK_ACTION_TYPE]: app.const.DYNAMIC_ACTION_BROWSE,
                [app.keywords.PAGE]: page,
                [app.keywords.RANK_NODE_ID]: this.topNodeId,
            }
        };

        app.service.send(sendObject, (res) => {
            if (res['unl'].length > 0) {
                const topVipName = res['unl'][0];

                this.top1Name.string = topVipName;

                // const top1Icon = `http://${app.config.host}:3767/img/xgameupload/images/avatar/${topVipName}`;
                const top1Icon = 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Tamia_striatus_eating.jpg';
                log(top1Icon);
                RubUtils.loadSpriteFrame(this.top1Sprite, top1Icon, cc.size(128, 128), true);
            }

            const data = [
                res['unl'].map((status, index) => {
                    return `${index + 1}. `;
                }),
                res['unl'],
                res['ui1l'].map((amount) => {
                    return `${numeral(amount).format('0,0')}`;
                }),

            ];

            cb(data);
        });
    }

    onPreviousBtnClick() {
        this.currentPage -= 1;
        if (this.currentPage < 1) {
            this.currentPage = 1;
            return null;
        }
        this.loader.show();
        this._initItems(this.currentPage);
    }

    onNextBtnClick() {
        this.loader.show();

        this.currentPage += 1;
        this._initItems(this.currentPage);
    }

    _initBody(data) {
        let body = this.contentNode;

        this.gridViewRub.resetData(data);

        let node = this.gridViewRub.getNode();
        (!node.parent) && body.addChild(node);

        this.loader.hide();
    }
}

app.createComponent(TabTopDaiGia);