import app from 'app';
import Component from 'Component';
import LoaderRub from 'LoaderRub';
import numeral from 'numeral';

export default class TabUserInfo extends Component {
    constructor() {
        super();
    }

    onLoad() {
        // spin loader
        this.loader = new LoaderRub(this.node.parent.parent);
        this.loader.show();

        this._initComponents();

        this._initUserData().then((userData) => {
            this._fillData(userData);
        });
    }

    _initComponents() {
        let avatarBgNode = this.node.getChildByName('leftPanel').getChildByName('ava_circle');
        this.avatar = avatarBgNode.getChildByName('Sprite').getComponent(cc.Sprite);
        // create properties by node name
        this.node.getChildByName('rightPanel').children.forEach((row) => {
            let rowChild = row.children;
            if (rowChild[1])
                this[rowChild[1].name] = rowChild[1].getComponent(cc.Label);
        });
    }

    _initUserData() {
        return new Promise((resolve) => {
            let data = {};
            data[app.keywords.USER_NAME] = app.context.getMyInfo().name;

            let sendObj = {
                cmd: app.commands.USER_PROFILE,
                data
            };

            app.service.send(sendObj, (data) => {
                if (data) {
                    resolve(data);
                    this.loader.hide();
                }
            });
        });
    }

    _fillData(userData) {
        this.userName.string = app.context.getMyInfo().name;
        this.userId.string = app.context.getMyInfo().id;
        this.chipAmount.string = numeral(app.context.getMyInfo().coin).format('0,0');
        this.vipRank.string = userData[app.keywords.LEVEL_TITLE];
        this.nextRank.string = "";
        this.privillege.string = "";
    }
}

app.createComponent(TabUserInfo);