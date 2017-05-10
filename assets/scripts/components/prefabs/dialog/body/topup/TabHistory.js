import app from 'app';
import PopupTabBody from 'PopupTabBody';
import Utils from 'Utils';

class TabHistory extends PopupTabBody {
    constructor() {
        super();
        this.properties = {
            ...this.properties,
            bodyNode: cc.Node,
            p404: cc.Node
        };
    }

    onLoad() {
        super.onLoad();
    }

    loadData() {
        if(Object.keys(this._data).length > 0)
            return false;
        super.loadData();
        
        this._requestHistories();
        return false;
    }
    
    onDataChanged(histories) {
        histories && this._renderHistory(histories);
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
        this.setLoadedData(data.histories || []);
    }

    _requestHistories() {
        var sendObject = {
            'cmd': 'userChargeHistory',
            data: {
                p: 1
            }
        };
        
        this.showLoadingProgress();
        app.service.send(sendObject);
    }
    
    _renderHistory(histories) {
        this.hideEmptyPage(this.p404);
        let d = [];
        
        Object.values(histories).map((history, index) => {
            let {time, content, state} = history;
            d.push([Utils.timeFormat(time), content, state]);
        });
        
        if (d.length > 0) {
            let head = {
                data: ['Thời gian', 'Nội dung', 'Trạng thái'],
                options: {
                    fontColor: app.const.COLOR_YELLOW
                }
            };

            let rubOptions = {
                size: this.bodyNode.getContentSize(),
                group: { widths: [200, '', 150] },
                fontSize: 20,
                isValidated: true
            };

            this.initView(head, d, rubOptions);

            !this.getScrollViewNode().isChildOf(this.bodyNode) && this.bodyNode.addChild(this.getScrollViewNode());
        } else {
            this.showEmptyPage(this.p404);
        }
    }
}

app.createComponent(TabHistory);