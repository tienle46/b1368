import app from 'app';
import BaseScene from 'BaseScene';
import Keywords from 'Keywords';
import Commands from 'Commands';
import SFS2X from 'SFS2X';
import RubUtils from 'RubUtils';

export default class ListTableScene extends BaseScene {
    constructor() {

        super();

        this.containnerTableView = {
            default: null,
            type: cc.Sprite
        };

        this.contentInScroll = {
            default: null,
            type: cc.Layout
        };

        this.danThuongButton = {
            default: null,
            type: cc.Button
        };

        this.danChoiButton = {
            default: null,
            type: cc.Button
        };

        this.daiGiaButton = {
            default: null,
            type: cc.Button
        };

        this.tyPhuButton = {
            default: null,
            type: cc.Button
        };

        this.tableListCell = {
            default: null,
            type: cc.Prefab
        };

        this.topBar = {
            default: null,
            type: cc.Prefab

        };
    }

    onLoad() {

        this.addBottomBar();
        this.addTopBar();

        const width = this.containnerTableView.node.width;
        const itemDimension = width;

        this._addGlobalListener();

        for (let i = 0; i < 14; i++) {

            const listCell = new cc.instantiate(this.tableListCell);

            listCell.setContentSize(itemDimension - 16, 50);
            listCell.setPosition(cc.p(0, 0));

            const cellComponent = listCell.getComponent('TableListCell');
            if ((i / 2) == 0) {
                cellComponent.setOnClickListener(() => {
                    this._createRoom(app.const.gameCode.TLMNDL, 1, 4);
                });
            } else {
                cellComponent.setOnClickListener(() => {
                    let data = {};
                    data[Keywords.GAME_CODE] = 'tnd';
                    data[Keywords.IS_SPECTATOR] = false;
                    data[Keywords.QUICK_JOIN_BET] = 1;

                    log("join room request");

                    app.service.send({ cmd: Commands.USER_QUICK_JOIN_ROOM, data: data });
                });
            }

            this.contentInScroll.node.addChild(listCell);
        }
    }

    _addGlobalListener() {
        super._addGlobalListener();
    }

    _removeGlobalListener() {
        super._removeGlobalListener();
    }

    _createRoom(gameCode = null, minBet = 0, roomCapacity = 2, password = undefined) {

        const requestParam = {};
        requestParam[app.keywords.ROOM_BET] = minBet;
        requestParam[app.keywords.GAME_CODE] = gameCode;
        requestParam[app.keywords.ROOM_PASSWORD] = password;
        requestParam[app.keywords.ROOM_CAPACITY] = roomCapacity;

        /**
         * If create room successfully, response going handle by join room success follow
         */
        app.service.send({ cmd: app.commands.USER_CREATE_ROOM, data: requestParam, room: null}, (error) => {
            if (error.errorCode) {
                app.system.error(error.errorMessage);
            }
        });
    }

    // Listen Bottom Bar Event (Click button In Bottom Bar)

    addBottomBar() {
        RubUtils.loadRes('bottombar/bottombar').then((prefab) => {
            let bottomBarNode = cc.instantiate(prefab);

            this.node.addChild(bottomBarNode);
        });
    }

    addTopBar() {
        let topBarNode = new cc.instantiate(this.topBar);

        let topBarScript = topBarNode.getComponent('TopBar');
        topBarScript.showBackButton();
        topBarScript.addListennerBackAction(() => {
            cc.director.loadScene('DashboardScene');
        });

        let winsize = cc.director.getWinSize();

        topBarNode.setContentSize(winsize.width, 100);
        this.node.addChild(topBarNode);
    }

    createTableView() {

        // var winSize = cc.Director.getInstance().getWinSize();

        // var tableView = cc.TableView.create();
        // // tableView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        // tableView.setPosition(cc.p(winSize.width /2, winSize.height / 2 ));
        // // tableView.setDelegate(this);
        // tableView.setVerticalFillOrder(cc.TABLEVIEW_FILL_TOPDOWN);
        // // tableView.reloadData();
        // this.containnerTableView.node.addChild(tableView);
    }
}

app.createComponent(ListTableScene);