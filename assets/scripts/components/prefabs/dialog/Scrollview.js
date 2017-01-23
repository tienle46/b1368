import app from 'app';
import Component from 'Component';
import RubUtils from 'RubUtils';
import NodeRub from 'NodeRub';

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

        this.prevLen = 1;
    }

    initGrid(head, body, options) {
        this.options = Object.assign({}, this.options, options);
        // this.options = options;

        this._gridview = cc.instantiate(this.gridview);
        this.addNode(this._gridview);

        this._gridviewComp = this._gridview.getComponent('Gridview');

        if (this._gridviewComp) {
            body = this._validatedInput(body);
            this.prevLen = body.length;

            this._detectViewState(body);

            this._gridviewComp.init(head, body, options);
            let wo;
            if (!this.options.paging) {
                this._hidePaging();
                this.bodyNode.setContentSize(this.node.getContentSize().width, 426);
                this.viewNode.setContentSize(this.node.getContentSize().width, 426);
                wo = { bottom: -60 };
                NodeRub.addWidgetComponentToNode(this.viewNode, wo);
            } else {
                this._showPaging();

                this.bodyNode.setContentSize(this.node.getContentSize().width, 366);
                this.viewNode.setContentSize(this.node.getContentSize().width, 366);
                wo = { bottom: 60 };
                // NodeRub.addWidgetComponentToNode(this.viewNode, wo);

                // settup click events
                let prevEvent = this.options.paging.prev;
                let nextEvent = this.options.paging.next;
                this._addEventPagingBtn(prevEvent, nextEvent, this.options.paging.context);

                this._updatePagingState();
            }
            wo = null;

            this._addToNode(this.contentNode);
        }
        RubUtils.releaseArray([head, body], true);
    }

    updateOptions(options) {
        this.options = Object.assign({}, this.options, options);
    }

    updateView(head, data, options) {
        this._setupInNewBody();
        data = this._validatedInput(data);

        this._detectViewState(data);

        this.prevLen = data.length;

        this._p404 && (this._p404.active = false);

        this._updatePagingState();

        this.viewNode.active = true;

        this._gridviewComp.updateView(head, data, options);

        RubUtils.releaseArray([head, data], true);
    }

    _detectViewState(data) {
        this.isEndedPage = data.length < this.prevLen;

        if (data.length == 0) {
            this._pageIsEmpty();
            this._updatePagingState();
            return;
        }
    }

    _updatePagingState() {
        // currentPage = 1
        //  -> end
        if (this.isEndedPage && this.currentPage == 1) {
            this._hidePaging();
            return;
        }
        this._showPaging();

    }

    _hidePaging() {
        this.pagingNode.active = false;
    }

    _showPaging() {
        this.pagingNode.active = true;

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
            this.bodyNode.addChild(this._p404);
        }
        this.viewNode.active = false;
        this._p404.active = true;

        // if (str) {
        //     let p404Component = p404.getComponent('P404');
        //     p404Component && p404Component.setText(str);
        // }
    }

    _setupInNewBody() {
        if (this.options.isNew) {
            this.currentPage = 1;
            this.isEndedPage = false;
            this.prevLen = 1;
        }
    }

    _addToNode(node) {
        if (this._gridview) {
            node.addChild(this._gridview);
        }
    }

    _addEventPagingBtn(prevEvent, nextEvent, context) {
        if (prevEvent) {
            if (prevEvent instanceof Function) {
                this.prevBtn.node.on(cc.Node.EventType.TOUCH_END, () => {
                    if (this.currentPage == 1) {
                        this._hideBtn(this.prevBtn);
                        return;
                    }
                    this.currentPage--;

                    this._showBtn(this.prevBtn);

                    prevEvent.call(context, this.currentPage);
                });
            }
        }

        if (nextEvent) {
            if (nextEvent instanceof Function) {
                this.nextBtn.node.on(cc.Node.EventType.TOUCH_END, () => {
                    if (this.isEndedPage) {
                        this._hideBtn(this.nextBtn);
                        return;
                    }
                    this._showBtn(this.nextBtn);
                    this.currentPage++;

                    nextEvent.call(context, this.currentPage);
                });
            }
        }
    }

    _showBtn(btn) {
        btn.interactable = true;
        btn.node.opacity = 255;
    }

    _hideBtn(btn) {
        btn.interactable = false;
        btn.node.opacity = 0;
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
        //     console.debug('input', input);

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