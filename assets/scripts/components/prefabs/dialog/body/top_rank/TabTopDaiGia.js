import app from 'app';
import DialogActor from 'DialogActor';
import numeral from 'numeral';

class TabTopDaiGia extends DialogActor {
    constructor() {
        super();

        this.properties = {
            ...this.properties,
            contentNode: cc.Node,
            crownsNode: cc.Node,
            userMoneyLbl: cc.Label,
        }

        this.currentPage = 1;
    }

    onLoad() {
        super.onLoad();
    }

    start() {
        super.start();
        this._getDataFromServer(this.currentPage)
    }

    _addGlobalListener() {
        super._addGlobalListener();
        app.system.addListener(app.commands.RANK_GROUP, this._onGetRankGroup, this);
    }

    _removeGlobalListener() {
        super._removeGlobalListener();
        app.system.removeListener(app.commands.RANK_GROUP, this._onGetRankGroup, this);
    }

    _getDataFromServer(page) {
        let topNodeId = 8;
        let sendObject = {
            'cmd': app.commands.RANK_GROUP,
            'data': {
                [app.keywords.RANK_GROUP_TYPE]: app.const.DYNAMIC_GROUP_LEADER_BOARD,
                [app.keywords.RANK_ACTION_TYPE]: app.const.DYNAMIC_ACTION_BROWSE,
                [app.keywords.PAGE]: page,
                [app.keywords.RANK_NODE_ID]: topNodeId,
            }
        };

        app.system.showLoader();
        app.service.send(sendObject);
    }

    _onGetRankGroup(res) {
        this.contentNode.children && this.contentNode.children.map(child => cc.isValid(child) && child.destroy() && child.removeFromParent());
        res[app.keywords.USERNAME_LIST] = res[app.keywords.USERNAME_LIST] || [];
        if (res[app.keywords.USERNAME_LIST].length < 0) {
            this.pageIsEmpty(this.contentNode);
            return;
        }
        let data = [
            res[app.keywords.USERNAME_LIST].map((status, index) => {
                let p = res['p'] || 1;
                let order = (index + 1) + (p - 1) * 20;
                if (this.crownsNode.children[index] && order <= 3)
                    return cc.instantiate(this.crownsNode.children[index]);
                else
                    return `${order}.`;
            }),
            res[app.keywords.USERNAME_LIST],
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

        this.initGridView(head, data, rubOptions);

        data = null; // collect item

        let node = this.getGridViewNode();

        app.system.hideLoader();

        (!node.parent) && this.contentNode.addChild(node);
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