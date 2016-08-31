var BaseScene = require('BaseScene');

cc.Class({
    extends: BaseScene,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...

        containnerTableView: {
            default:null,
            type:cc.Sprite
        },

        contentInScroll : {
            default:null,
            type:cc.Layout
        },

        danThuongButton: {
            default:null,
            type:cc.Button
        },

        danChoiButton: {
            default: null,
            type:cc.Button
        },

        daiGiaButton: {
            default:null,
            type:cc.Button
        },

        tyPhuButton: {
            default:null,
            type:cc.Button
        },

        tableListCell : {
            default:null,
            type: cc.Prefab
        },

        bottomBar: {
            default:null,
            type:cc.Prefab
        },

        topBar: {
            default:null,
            type:cc.Prefab
        }

    },

    // use this for initialization
    onLoad: function () {

        this.addBottomBar();
        this.addTopBar();

        const width = this.containnerTableView.node.width;
        const itemDimension = width;

       for (let i = 0; i < 14; i++) {

           let listCell = new cc.instantiate(this.tableListCell);
           listCell.setContentSize(itemDimension - 16 ,50);
           listCell.setPosition(cc.p(0,0));
           this.contentInScroll.node.addChild(listCell);
       }
    },

    // Listen Bottom Bar Event (Click button In Bottom Bar)

    addBottomBar:function () {

        const bottomBarNode = new cc.instantiate(this.bottomBar);

        bottomBarNode.getComponent('BottomBar').listenClickTopBarItem( (buttonType) => {
            console.log("dashboard:" + buttonType);
            this.addPopup();
        });

        this.node.addChild(bottomBarNode);
    },

    addTopBar: function () {
        let topBarNode = new cc.instantiate(this.topBar);

        topBarNode.getComponent('TopBar').showBackButton();
      let winsize =  cc.director.getWinSize()

        topBarNode.setContentSize(winsize.width,100);
        this.node.addChild(topBarNode);
    },
    
    createTableView: function () {

        // var winSize = cc.Director.getInstance().getWinSize();

        // var tableView = cc.TableView.create();
        // // tableView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        // tableView.setPosition(cc.p(winSize.width /2, winSize.height / 2 ));
        // // tableView.setDelegate(this);
        // tableView.setVerticalFillOrder(cc.TABLEVIEW_FILL_TOPDOWN);
        // // tableView.reloadData();
        // this.containnerTableView.node.addChild(tableView);
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
