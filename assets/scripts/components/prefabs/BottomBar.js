var game = require("game");

cc.Class({
    extends: cc.Component,

    properties: {

        napxuButton: {
          default:null,
            type:cc.Button
        },

        topRankButton: {
            default: null,
            type:cc.Button
        },

        notifiButton: {
            default: null,
            type:cc.Button
        },

        awardTransferButton: {
            default:null,
            type:cc.Button
        },

        hotlineButton: {
            default:null,
            type:cc.Button
        },

        messageButton: {
            default:null,
            type:cc.Button
        },

        userInfoButton: {
            default:null,
            type:cc.Button
        },

        _clickListener: null

    },

    // use this for initialization
    onLoad: function () {

    },

    // handle click button in bottomBar

    onClickNapXuAction: function () {
        console.log("nap xu");

        this.handleClickTopbarItem(game.bottomBarButtonType.NAPXU);
    },

    onClickTopRankAction: function () {
        console.log("rank");
        this.handleClickTopbarItem(game.bottomBarButtonType.TOPRANK);
    },

    onClickNotifiAction: function () {
        console.log("Notifi");
        this.handleClickTopbarItem(game.bottomBarButtonType.NOTIFI);
    },

    onClickTransferAwardAction: function () {
        console.log("Award");
        this.handleClickTopbarItem(game.bottomBarButtonType.EXCHANGEAWARD);
    },

    onClickHotlineAction: function () {
        console.log("Hotline");
        this.handleClickTopbarItem(game.bottomBarButtonType.HOTLINE);
    },

    onClickMessageAction: function () {
        console.log("Message");
        this.handleClickTopbarItem(game.bottomBarButtonType.MESSAGE);
    },

    onClickUserInfoAction: function () {
       console.log("UserInfo");
        this.handleClickTopbarItem(game.bottomBarButtonType.USERINFO);
    },

    listenClickTopBarItem: function (cb) {
        this._clickListener = cb;
    },

    // truyen vao button type (xác định đang xử lý sự kiện cho button ).
    handleClickTopbarItem: function (buttonType) {

        console.log("type: " + buttonType);
        this._clickListener && this._clickListener(buttonType);
    }


    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});