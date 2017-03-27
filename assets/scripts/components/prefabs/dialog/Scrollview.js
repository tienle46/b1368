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

        this._gridview = null;
        this._gridviewComp = null;
        this._p404 = null;

        this.itemsPerPage = 10;
    }

    onDestroy() {
        this.prevBtn.node && this.prevBtn.node.off(cc.Node.EventType.TOUCH_END, this._registerPrevEventBtnClick);
        this.prevBtn.node && this.nextBtn.node.off(cc.Node.EventType.TOUCH_END, this._registerNextEventBtnClick);
        window.free(this.options);
        super.onDestroy();
    }

    initView(head, body, options) {
        this.options = Object.assign({}, this.options, options);
        // this.options = options;

        this._gridview = cc.instantiate(this.gridview);
        this.addNode(this._gridview);

        this._gridviewComp = this._gridview.getComponent('Gridview');

        if (this._gridviewComp) {

            if (this.options.isListView) {
                // this.itemsPerPage = body.length;
                this._gridviewComp.initList(body, options);
            } else {
                body = this._validatedInput(body);
                this._gridviewComp.init(head, body, options);
            }
            let bLen = body.length;

            this.isEndedPage = bLen < this.itemsPerPage;

            this._updateItemsPerPage(body);

            if (body.length == 0) {
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

                this.bodyNode.setContentSize(this.node.getContentSize().width, 366);
                this.node.setContentSize(this.node.getContentSize().width, 366);
                this.viewNode.setContentSize(this.node.getContentSize().width, 366);
                
                let wo = { bottom: 60 };
                NodeRub.addWidgetComponentToNode(this.bodyNode, wo);
                
                // settup click events
                this._addEventPagingBtn(this.options.paging);

                this._updatePagingState();
            }

            this._addToNode(this.contentNode);
        }
        window.free(head);
        window.release(head, body, true);
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
            this._gridviewComp.updateList(data, options);
        } else {
            this._gridviewComp.updateView(head, data, options);
        }

        window.release(head, data, true);
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
        active(this.pagingNode);

        // setup Button state
        (this.isEndedPage || (this._p404 && this._p404.active)) ? this._hideBtn(this.nextBtn): this._showBtn(this.nextBtn);
        this.currentPage == 1 ? this._hideBtn(this.prevBtn) : this._showBtn(this.prevBtn);
    }

    _validatedInput(data) {
        return app._.isArray(data) ? (this.options.isValidated ? data : this._validateData(data)) : [];
    }

    _pageIsEmpty() {
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
        if (this._gridview) {
            node.addChild(this._gridview);
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

        return out;
    }
}

app.createComponent(Scrollview);