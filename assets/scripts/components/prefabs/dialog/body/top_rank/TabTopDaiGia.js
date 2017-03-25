import app from 'app';
import DialogActor from 'DialogActor';
import Utils from 'Utils';

class TabTopDaiGia extends DialogActor {
    constructor() {
        super();

        this.properties = {
            ...this.properties,
            contentNode: cc.Node,
            crownsNode: cc.Node,
            userMoneyLbl: cc.Label,
        }
    }

    onLoad() {
        super.onLoad();
    }

    start() {
        super.start();
        this._getDataFromServer()
    }

    _addGlobalListener() {
        super._addGlobalListener();
        app.system.addListener(app.commands.GET_TOP_BALANCE_PLAYERS, this._onGetTopBalancePlayers, this);
    }

    _removeGlobalListener() {
        super._removeGlobalListener();
        app.system.removeListener(app.commands.GET_TOP_BALANCE_PLAYERS, this._onGetTopBalancePlayers, this);
    }

    _getDataFromServer(page) {
        this.showLoader(this.contentNode);
        app.service.send({
            'cmd': app.commands.GET_TOP_BALANCE_PLAYERS,
        });
    }

    _onGetTopBalancePlayers(res) {
        let {usernames, balances} = res;
        
       
        if (usernames.length < 0) {
            this.pageIsEmpty(this.contentNode);
            return;
        }
        let data = [
            usernames.map((status, index) => {
                let p = res['p'] || 1;
                let order = (index + 1) + (p - 1) * 20;
                if (this.crownsNode.children[index] && order <= 3)
                    return cc.instantiate(this.crownsNode.children[index]);
                else
                    return `${order}.`;
            }),
            usernames,
            balances.map((amount) => {
                this.userMoneyLbl.string = `${Utils.numberFormat(amount)}`;
                return cc.instantiate(this.userMoneyLbl.node);
            }),
        ];
        let head = {
            data: ['STT', 'Tài khoản', 'Chips'],
            options: {
                fontColor: app.const.COLOR_YELLOW
            }
        };

        let next = this.onNextBtnClick;
        let prev = this.onPreviousBtnClick;

        let rubOptions = {
            // paging: { prev, next, context: this },
            size: this.contentNode.getContentSize(),
            group: { widths: ['', 380, ''] }
        };

        this.initView(head, data, rubOptions);

        this.contentNode.addChild(this.getScrollViewNode());
        this.hideLoader(this.contentNode);
    }

    onPreviousBtnClick(page) {
        this._getDataFromServer(page);
    }

    onNextBtnClick(page) {
        this._getDataFromServer(page);
    }
}

app.createComponent(TabTopDaiGia);