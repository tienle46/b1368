import app from 'app';
import PopupTabBody from 'PopupTabBody';

class TabTopVip extends PopupTabBody {
    constructor() {
        super();

        this.properties = {
            ...this.properties,
            contentNode: cc.Node,
            crowns: cc.Node,
            vips: cc.Node,
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
        
        this._getRankGroup();
        return true;
    }
    
    onDataChanged({usernames = []} = {}) {
        usernames && usernames.length > 0 && this._renderGridFromUsernames(usernames);
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
        app.service.send({
            'cmd': app.commands.GET_TOP_VIP_PLAYERS,
        });
        this.showLoadingProgress();
    }

    _onGetTopVipPlayers(data) {
        this.setLoadedData(data); 
    }
    
    _renderGridFromUsernames(usernames) {
        if (usernames.length < 0) {
            this.showEmptyPage(this.p404);
            return;
        }
        let data = [
            usernames.map((status, index) => {
                if (this.crowns.children[index])
                    return cc.instantiate(this.crowns.children[index]);
                else
                    return `${index + 1}`;
            }),
            usernames,
            usernames.map((status, index) => {
                let len = this.vips.children.length;
                this.vips.children.forEach(child => child.active = false);
                
                this.vips.children[index] ? (this.vips.children[index].active = true) : (this.vips.children[len - 1].active = true);
                
                return cc.instantiate(this.vips);
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
        !this.getScrollViewNode().isChildOf(this.contentNode) && this.contentNode.addChild(this.getScrollViewNode());
    }
}

app.createComponent(TabTopVip);