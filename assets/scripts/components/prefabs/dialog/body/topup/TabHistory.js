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
            let d = [
                [],
                [],
                [],
                [],
            ];
            histories.map((history, index) => {
                d[0].push(`${index + 1}`);
                d[1].push(history.time);
                d[2].push(history.money);
                d[3].push(history.balance);
            });

            let head = {
                data: ['STT', 'Thời gian', 'Nội dung', 'Trạng thái'],
                options: {
                    fontColor: app.const.COLOR_YELLOW,
                    fontSize: 25
                }
            };

            let rubOptions = {
                spacingX: 0,
                spacingY: 0,
                // paging: { prev, next },
                position: cc.v2(0, 10),
                height: 390,
                group: { widths: [100, '', '', ''] }
            };

            this.initGridView(head, d, rubOptions);
            data = null;
            d = null;

            let node = this.getGridViewNode();

            app.system.hideLoader();

            this.bodyNode.addChild(node);
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