import app from 'app';
import PopupTabBody from 'PopupTabBody';
import MessageEvent from 'MessageEvent';
import CCUtils from 'CCUtils';

export default class TabMessages extends PopupTabBody {
    constructor() {
        super();

        this.properties = {
            ...this.properties,
            itemPrefab: cc.Prefab,
        };
    }
    
    onEnable() {
        super.onEnable();
    }
    
    loadData() {
        if(Object.keys(this._data).length > 0)
            return false;
        super.loadData();
        this._requestMessagesList();
        return true;
    }
    
    onPreviousBtnClick(page) {
        this._requestMessagesList(page);
    }

    onNextBtnClick(page) {
        this._requestMessagesList(page);
    }
    
    _addGlobalListener() {
        super._addGlobalListener();
    }

    _removeGlobalListener() {
        super._removeGlobalListener();
    }
    
    /**
     * @abstract
     * 
     * @param {number} [page=1] 
     * 
     * @memberOf TabMessages
     */
    _requestMessagesList(page = 1) {}
    
    _initRequest(cmd, page = 1) {
        app.service.send({
            cmd,
            data: {
                [app.keywords.PAGE_NEW]: page
            }
        });
        this.showLoadingProgress();
    }
    
    /**
     * 
     * @param {Array} data 
     * 
     * @memberOf TabMessages
     */
    displayMessages(data) {
        let next = this.onPreviousBtnClick,
            prev = this.onNextBtnClick;
        
        this.initView(null, data, {
            paging: { next, prev, context: this },
            size: this.node.getContentSize(),
            isListView: true
        });
        this.node.addChild(this.getScrollViewNode());
    }
    
    hide() {
        let parent = this.node.parent;

        CCUtils.clearFromParent(this.node);
        CCUtils.clearFromParent(parent);
    }
}

app.createComponent(TabMessages);