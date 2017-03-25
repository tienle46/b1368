import app from 'app';
import DialogActor from 'DialogActor';

class TabTopVip extends DialogActor {
    constructor() {
        super();

        this.properties = {
            ...this.properties,
            contentNode: cc.Node,
            crowns: cc.Node,
            vips: cc.Node,
        };
    }

    onLoad() {
        super.onLoad();
    }

    start() {
        super.start();
        this._getRankGroup();
    }

    _addGlobalListener() {
        super._addGlobalListener();
        app.system.addListener(app.commands.GET_TOP_VIP_PLAYERS, this._onGetTopVipPlayers, this);
    }

    _removeGlobalListener() {
        super._removeGlobalListener();
        app.system.removeListener(app.commands.GET_TOP_VIP_PLAYERS, this._onGetTopVipPlayers, this);
    }

    _getRankGroup() {
        this.showLoader(this.contentNode);
        app.service.send({
            'cmd': app.commands.GET_TOP_VIP_PLAYERS,
        });
    }

    _onGetTopVipPlayers(d) {
        let {usernames} = d;
        if (usernames.length < 0) {
            this.pageIsEmpty(this.contentNode);
            return;
        }
        let data = [
            usernames.map((status, index) => {
                if (this.crowns.children[index])
                    return cc.instantiate(this.crowns.children[index]);
                else
                    return `${index + 1}.`;
            }),
            usernames,
            usernames.map((status, index) => {
                let len = this.vips.children.length;
                return cc.instantiate(this.vips.children[index] ? this.vips.children[index] : this.vips.children[len - 1]);
            }),
        ];
        
        this.contentNode.setContentSize(850, this.contentNode.getContentSize().height);
        this.initView({
            data: ['STT', 'Tài khoản', 'Loại'],
            options: {
                fontColor: app.const.COLOR_YELLOW
            }
        }, data, {
            size: this.contentNode.getContentSize(),
        });
        this.contentNode.addChild(this.getScrollViewNode());
        this.hideLoader(this.contentNode);
    }
}

app.createComponent(TabTopVip);