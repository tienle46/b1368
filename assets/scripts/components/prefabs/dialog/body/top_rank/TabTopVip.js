import app from 'app';
import Component from 'Component';
import GridViewRub from 'GridViewRub';

class TabTopVip extends Component {
    constructor() {
        super();

        this.flag = null;
        this.topNodeId = 14;
        this.currentPage = 1;

        this.contentNode = {
            default: null,
            type: cc.Node
        };

        this.crowns = {
            default: null,
            type: cc.Node
        };

        this.vips = {
            default: null,
            type: cc.Node
        };
    }

    onLoad() {
        this._initData((data) => {
            this._initBody(data);
        });
    }

    _initData(cb) {
        app.system.showLoader();
        let sendObject = {
            'cmd': app.commands.RANK_GROUP,
            'data': {
                [app.keywords.RANK_GROUP_TYPE]: app.const.DYNAMIC_GROUP_LEADER_BOARD,
                [app.keywords.RANK_ACTION_TYPE]: app.const.DYNAMIC_ACTION_BROWSE,
                [app.keywords.PAGE]: this.currentPage,
                [app.keywords.RANK_NODE_ID]: this.topNodeId,
            }
        };

        app.service.send(sendObject, (res) => {
            cb(res);
        });
    }

    _initBody(d) {
        const ul = d['unl'];

        const data = [
            ul.map((status, index) => {
                if (this.crowns.children[index])
                    return cc.instantiate(this.crowns.children[index]);
                else
                    return `${index + 1}.`;
            }),
            ul,
            ul.map((status, index) => {
                let len = this.vips.children.length;
                return cc.instantiate(this.vips.children[index] ? this.vips.children[index] : this.vips.children[len - 1]);
            }),
        ];

        GridViewRub.show(this.contentNode, {
            data: ['STT', 'Tài khoản', 'Loại'],
            options: {
                fontColor: app.const.COLOR_YELLOW
            }
        }, data, {
            height: 425,
        });
        app.system.hideLoader();
    }
}

app.createComponent(TabTopVip);