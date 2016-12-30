import app from 'app';
import Component from 'Component';
import GridViewRub from 'GridViewRub';
import numeral from 'numeral';

class TabTopDaiGia extends Component {
    constructor() {
        super();

        this.properties = {
            ...this.properties,
            contentNode: cc.Node,
            crownsNode: cc.Node,
            userMoneyLbl: cc.Label,
        }

        this.flag = null;
        this.topNodeId = 8;
        this.currentPage = 1;
    }

    onLoad() {
        this._getDataFromServer(this.currentPage);
    }

    _getDataFromServer(page) {
        app.system.showLoader();
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
            const data = [
                res['unl'].map((status, index) => {
                    if (this.crownsNode.children[index])
                        return cc.instantiate(this.crownsNode.children[index]);
                    else
                        return `${index + 1}.`;
                }),
                res['unl'],
                res['ui1l'].map((amount) => {
                    this.userMoneyLbl.string = `${numeral(amount).format('0,0')}`;
                    let usermoneyLbl = cc.instantiate(this.userMoneyLbl.node);
                    return usermoneyLbl;
                }),

            ];
            let head = {
                data: ['STT', 'Tài khoản', 'Chips'],
                options: {
                    fontColor: app.const.COLOR_YELLOW,
                    fontSize: 25
                }
            };

            let next = this.onNextBtnClick.bind(this);
            let prev = this.onPreviousBtnClick.bind(this);

            let rubOptions = {
                paging: { prev, next },
                position: cc.v2(0, 10),
                height: 390,
                group: { widths: ['', '', 380] }
            };

            let gridViewRub = new GridViewRub(head, data, rubOptions);
            let body = this.contentNode;

            let node = gridViewRub.getNode();

            app.system.hideLoader();

            (!node.parent) && body.addChild(node);
        });
    }

    onPreviousBtnClick() {
        this.currentPage -= 1;
        if (this.currentPage < 1) {
            this.currentPage = 1;
            return null;
        }
        this._getDataFromServer(this.currentPage);
    }

    onNextBtnClick() {
        this.currentPage += 1;
        this._getDataFromServer(this.currentPage);
    }
}

app.createComponent(TabTopDaiGia);