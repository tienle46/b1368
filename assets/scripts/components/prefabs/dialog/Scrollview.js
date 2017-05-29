import app from 'app';
import Component from 'Component';
import NodeRub from 'NodeRub';
import { isFunction } from 'Utils';
import { active, deactive } from 'CCUtils';

export default class Scrollview extends Component {
    constructor() {
        super();

        this.properties = {
            gridview: cc.Prefab,
            listview: cc.Prefab,
            p404: cc.Prefab,
            contentNode: cc.Node,
            pagingNode: cc.Node,
            bodyNode: cc.Node,
            viewNode: cc.Node,
            prevBtn: cc.Button,
            nextBtn: cc.Button
        };

        this.options = {};
        this.currentPage = 1;
        this.isEndedPage = false;

        this._view = null;
        this._viewComp = null;
        this._p404 = null;

        this.itemsPerPage = 10;
    }

    onDestroy() {
        this.prevBtn.node && this.prevBtn.node.off(cc.Node.EventType.TOUCH_END, this._registerPrevEventBtnClick);
        this.prevBtn.node && this.nextBtn.node.off(cc.Node.EventType.TOUCH_END, this._registerNextEventBtnClick);
        window.free(this.options);
        super.onDestroy();
    }

    initView(headData, mainData, options) {
        this.options = Object.assign({}, this.options, options);
        // this.options = options;
        
        // is Listview
        let componetName;
        if (this.options.isListView) {
            this._view = cc.instantiate(this.listview);
            componetName = 'ListView';
        } else { // is Gridview
            this._view = cc.instantiate(this.gridview);
            componetName = 'Gridview';
        }
        this.addNode(this._view);
        this._viewComp = this._view.getComponent(componetName);

        if (this._viewComp) {
            if (this.options.isListView) {
                // this.itemsPerPage = body.length;
                this._viewComp.init(mainData, options);
            } else {
                mainData = this._validatedInput(mainData);
                this._viewComp.init(headData, mainData, options);
            }
            let total = mainData.length;

            this.isEndedPage = total < this.itemsPerPage;

            this._updateItemsPerPage(mainData);
            
            console.warn('mainData.length', mainData.length);
            if (mainData.length == 0) {
                this._pageIsEmpty();
                this._updatePagingState();
                return;
            }

            if (!this.options.paging) {
                this._hidePaging();
                // this.bodyNode.setContentSize(this.node.getContentSize().width, 426);
                // this.node.setContentSize(this.node.getContentSize().width, 426);
                // this.viewNode.setContentSize(this.node.getContentSize().width, 426);
                // let wo = { bottom: -60 };
                // NodeRub.addWidgetComponentToNode(this.viewNode, wo);
            } else {
                this._showPaging();
                this._resizeView(true);

                // settup click events
                this._addEventPagingBtn(this.options.paging);

                this._updatePagingState();
            }

            this._addToNode(this.contentNode);
        }
        
        window.release([headData, mainData], true);
    }

    updateOptions(options) {
        this.options = Object.assign({}, this.options, options);
    }

    updateView(head, data, options) {
        this._setupInNewBody();
        data = this._validatedInput(data);

        this.isEndedPage = data.length < this.itemsPerPage;
        if (data.length == 0) {
            this._pageIsEmpty();
            this._updatePagingState();
            return;
        }

        this._updateItemsPerPage(data);

        this._p404 && deactive(this._p404);

        this._updatePagingState();

        active(this.viewNode);

        if (this.options.isListView) {
            this._viewComp.updateList(data, options);
        } else {
            this._viewComp.updateView(head, data, options);
        }

        window.release([head, data], true);
    }

    _updateItemsPerPage(items) {
        let len = items.length;
        if (len > this.itemsPerPage)
            this.itemsPerPage = items.length;
    }

    _updatePagingState() {
        // currentPage = 1
        //  -> end
        // if (this.isEndedPage && this.currentPage == 1) {
        //     this._hidePaging();
        //     return;
        // }
        if(this.options.paging)
            this._showPaging();
    }

    _hidePaging() {
        deactive(this.pagingNode);
    }

    _showPaging() {        
        // setup Button state
        (this.isEndedPage || (this._p404 && this._p404.active)) ? this._hideBtn(this.nextBtn): this._showBtn(this.nextBtn);
        this.currentPage == 1 ? this._hideBtn(this.prevBtn) : this._showBtn(this.prevBtn);
        
        active(this.pagingNode);
        let hasPaging = this.nextBtn.interactable || this.prevBtn.interactable;
        
        this._resizeView(hasPaging);
    }
    
    _resizeView(hasPaging) {
        if(hasPaging) {
            this.bodyNode.setContentSize(this.node.getContentSize().width, 374);
            this.node.setContentSize(this.node.getContentSize().width, 374);
            this.viewNode.setContentSize(this.node.getContentSize().width, 374);
            
            let wo = { bottom: 60 };
            NodeRub.addWidgetComponentToNode(this.bodyNode, wo);
        } else {
            this.bodyNode.setContentSize(this.node.getContentSize().width, 426);
            this.node.setContentSize(this.node.getContentSize().width, 426);
            this.viewNode.setContentSize(this.node.getContentSize().width, 426);
            let wo = { bottom: -60 };
            NodeRub.addWidgetComponentToNode(this.viewNode, wo);
            this._hidePaging();
        }
        
    }
    _validatedInput(data) {
        return app._.isArray(data) ? (this.options.isValidated ? data : this._validateData(data)) : [];
    }

    _pageIsEmpty() {
        console.warn('_p404');
        app.system.hideLoader();
        if (!this._p404) {
            this._p404 = cc.instantiate(this.p404);
            this.addNode(this._p404);
            this.bodyNode.addChild(this._p404);
        }
        deactive(this.viewNode);
        active(this._p404);
        // if (str) {
        //     let p404Component = p404.getComponent('P404');
        //     p404Component && p404Component.setText(str);
        // }
    }

    _setupInNewBody() {
        if (this.options.isNew) {
            this.currentPage = 1;
            this.isEndedPage = false;
        }
    }

    _addToNode(node) {
        if (this._view) {
            node.addChild(this._view);
        }
    }

    _addEventPagingBtn(pagingOptions) {
        if (pagingOptions.prev && isFunction(pagingOptions.prev)) {
            this.prevBtn.node.on(cc.Node.EventType.TOUCH_END, this._registerPrevEventBtnClick, this);
        }

        if (pagingOptions.next && isFunction(pagingOptions.next)) {
            this.nextBtn.node.on(cc.Node.EventType.TOUCH_END, this._registerNextEventBtnClick, this);
        }
    }

    _registerPrevEventBtnClick() {
        let prevEvent = this.options.paging.prev;
        
        if (this.currentPage == 1) {
            this._hideBtn(this.prevBtn);
            return;
        }
        this.currentPage--;
        
        this._showBtn(this.prevBtn);

        prevEvent.call(this.options.paging.context, this.currentPage);
    }

    _registerNextEventBtnClick() {
        let nextEvent = this.options.paging.next;

        if (this.isEndedPage) {
            this._hideBtn(this.nextBtn);
            return;
        }
        this._showBtn(this.nextBtn);
        
        this.currentPage++;
        
        nextEvent.call(this.options.paging.context, this.currentPage);
    }

    _showBtn(btn) {
        btn.interactable = true;
    }

    _hideBtn(btn) {
        btn.interactable = false;
    }

    /**
     * convert an array mapping to original array
     * let input = [
     *  ['content1', 'content2', 'content3'] # column 1
     *  ['value1', 'value2', 'value3'] # column 2
     *  ['any1', 'any2', 'any3'] # column 3
     *  [] # column 4
     * ]
     *  => 
     * output = [
     *  ['content1', 'value1', 'any1', ''],
     *  ['content2', 'value2', 'any2', ''],
     *  ['content3', 'value3', 'any3', '']
     * ]
     * @static
     * @param {Array} input
     * 
     * @memberOf GridViewRub
     */
    _validateData(input) {
        if(this.options.isListView)
            return input;
            
        if (input instanceof Array && input.length < 1)
            return [];

        // if (input instanceof Object) {
        //     // [{} {} {}] => [[], [], []]
        //     input.map(o => {
        //         let d = [];
        //         for (let [key, value] of Object.entries(o)) {
        //             d.push(value);
        //         }
        //         return d;
        //     });

        //     return input;
        // }
        
        let tmp = [];
        let out = [];
        if (input[0])
            while (input[0].length > 0) {
                let l = input.length;
                for (let i = 0; i < l; i++) {
                    tmp.push(input[i].shift() || null);
                }
                out.push(tmp);
                tmp = [];
            }
        // let clone = app._.cloneDeep(input);
        
        // if (clone[0])
        //     while (clone[0].length > 0) {
        //         let l = clone.length;
        //         for (let i = 0; i < l; i++)
        //             tmp.push(clone[i].shift() || null);
                    
        //         out.push(tmp);
        //         tmp = [];
        //     }
        return out;
    }
}

app.createComponent(Scrollview);