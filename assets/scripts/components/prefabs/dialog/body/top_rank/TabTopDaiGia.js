import app from 'app';
import PopupTabBody from 'PopupTabBody';
import Utils from 'Utils';

class TabTopDaiGia extends PopupTabBody {
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

    loadData() {
        if(Object.keys(this._data).length > 0)
            return false;
        super.loadData();
        
        this._getDataFromServer();
        return true;
    }
    
    onDataChanged({usernames = [], balances = [], gc} = {}) {
        usernames && usernames.length > 0 && this._renderGridFromUsernames(usernames, balances);
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
        app.service.send({
            'cmd': app.commands.GET_TOP_BALANCE_PLAYERS,
        });
        this.showLoadingProgress();
    }

    _onGetTopBalancePlayers(res) {
        this.setLoadedData(res);
    }
    
    _renderGridFromUsernames(usernames, balances) {
        if (usernames.length < 0) {
            this.pageIsEmpty(this.contentNode);
            return;
        }
        let data = [
            usernames.map((status, index) => {
                let order = index + 1;
                if (this.crownsNode.children[index] && order <= 3)
                    return cc.instantiate(this.crownsNode.children[index]);
                else
                    return `${order}`;
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
            group: { widths: [180, 380, ''] }
        };

        this.initView(head, data, rubOptions);

        this.contentNode.addChild(this.getScrollViewNode());
    }
}

app.createComponent(TabTopDaiGia);