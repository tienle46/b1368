import app from 'app';
import DialogActor from 'DialogActor';
import numeral from 'numeral';

class TabHistory extends DialogActor {
    constructor() {
        super();
        this.properties = {
            ...this.properties,
            bodyNode: cc.Node
        };
    }

    onLoad() {
        super.onLoad();
    }

    start() {
        super.start();
        this._requestHistories();
    }


    _addGlobalListener() {
        super._addGlobalListener();
        app.system.addListener('userChargeHistory', this._onUserChargeHistory, this);
    }

    _removeGlobalListener() {
        super._removeGlobalListener();
        app.system.removeListener('userChargeHistory', this._onUserChargeHistory, this);
    }

    _onUserChargeHistory(data) {
        let histories = data.histories || [];
        if (histories.length > 0) {
            let d = [];
            histories.map((history, index) => {
                d.push([`${index + 1}`, history.time, history.money, history.balance]);
            });

            let head = {
                data: ['STT', 'Thời gian', 'Nội dung', 'Trạng thái'],
                options: {
                    fontColor: app.const.COLOR_YELLOW,
                    fontSize: 25
                }
            };

            let rubOptions = {
                size: this.bodyNode.getContentSize(),
                group: { widths: [100, '', '', ''] },
                isValidated: true
            };

            this.initView(head, d, rubOptions);

            this.bodyNode.addChild(this.getScrollViewNode());
            app.system.hideLoader();
        } else {
            this.pageIsEmpty(this.bodyNode);
        }
    }

    _requestHistories() {
        var sendObject = {
            'cmd': 'userChargeHistory',
            data: {
                p: 1
            }
        };

        app.service.send(sendObject);
    }
}

app.createComponent(TabHistory);