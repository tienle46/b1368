import game from 'game'
import BaseScene from 'BaseScene'

export default class ListTableScene extends BaseScene {
    constructor() {

        super();

        this.containnerTableView = {
            default: null,
            type: cc.Sprite
        }

        this.contentInScroll = {
            default: null,
            type: cc.Layout
        }

        this.danThuongButton = {
            default: null,
            type: cc.Button
        }

        this.danChoiButton = {
            default: null,
            type: cc.Button
        }

        this.daiGiaButton = {
            default: null,
            type: cc.Button
        }

        this.tyPhuButton = {
            default: null,
            type: cc.Button
        }

        this.tableListCell = {
            default: null,
            type: cc.Prefab
        }

        this.bottomBar = {
            default: null,
            type: cc.Prefab
        }

        this.topBar = {
            default: null,
            type: cc.Prefab
        }
    }

    onLoad() {

        this.addBottomBar();
        this.addTopBar();

        const width = this.containnerTableView.node.width;
        const itemDimension = width;

        for (let i = 0; i < 14; i++) {

            const listCell = new cc.instantiate(this.tableListCell);

            listCell.setContentSize(itemDimension - 16, 50);
            listCell.setPosition(cc.p(0, 0));

            const cellComponent = listCell.getComponent('TableListCell');
            cellComponent.setOnClickListener(() => {
                this._createRoom(game.const.gameCode.TLMNDL, 1, 2);
            })

            this.contentInScroll.node.addChild(listCell);
        }
    }

    _createRoom(gameCode = null, minBet = 0, roomCapacity = 2, password = undefined){

        const requestParam = {};
        requestParam[game.keywords.ROOM_BET] = minBet
        requestParam[game.keywords.GAME_CODE] = gameCode
        requestParam[game.keywords.ROOM_PASSWORD] = password
        requestParam[game.keywords.ROOM_CAPACITY] = roomCapacity

        game.service.send({cmd: game.commands.USER_CREATE_ROOM, data: requestParam, room: null /*game.context.currentRoom*/}, (error, result) => {

            if(event.errorCode){
                game.system.error(event.errorMessage);
            }else{

                game.context.lastJoinRoom = result.room;
                if (result.room.isJoined && result.room.isGame) {
                    game.context.currentRoom = result.room;
                    game.system.loadScene(game.const.scene.GAME_SCENE)
                }
            }

        });
    }

    // Listen Bottom Bar Event (Click button In Bottom Bar)

    addBottomBar() {

        const bottomBarNode = new cc.instantiate(this.bottomBar);

        bottomBarNode.getComponent('BottomBar').listenClickTopBarItem((buttonType) => {
            console.log("dashboard:" + buttonType);
            this.addPopup();
        });

        this.node.addChild(bottomBarNode);
    }

    addTopBar() {
        let topBarNode = new cc.instantiate(this.topBar);

        let topBarScript = topBarNode.getComponent('TopBar');
        topBarScript.showBackButton();
        topBarScript.addListennerBackAction(() => {
            cc.director.loadScene('DashboardScene');
        });

        let winsize = cc.director.getWinSize()

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

game.createComponent(ListTableScene)