var app = require('app');

cc.Class({
    extends: cc.Component,

    properties: {

        napxuButton: {
            default: null,
            type: cc.Button
        },

        topRankButton: {
            default: null,
            type: cc.Button
        },

        notifiButton: {
            default: null,
            type: cc.Button
        },

        awardTransferButton: {
            default: null,
            type: cc.Button
        },

        hotlineButton: {
            default: null,
            type: cc.Button
        },

        messageButton: {
            default: null,
            type: cc.Button
        },

        userInfoButton: {
            default: null,
            type: cc.Button
        },

        _clickListener: null

    },

    // use this for initialization
    onLoad: function() {

    },

    // handle click button in bottomBar

    onClickNapXuAction: function() {
        log("nap xu");

        this.handleClickTopbarItem(app.bottomBarButtonType.NAPXU);
    },

    onClickTopRankAction: function() {
        log("rank");
        this.handleClickTopbarItem(app.bottomBarButtonType.TOPRANK);
    },

    onClickNotifiAction: function() {
        log("Notifi");
        this.handleClickTopbarItem(app.bottomBarButtonType.NOTIFI);
    },

    onClickTransferAwardAction: function() {
        log("Award");
        this.handleClickTopbarItem(app.bottomBarButtonType.EXCHANGEAWARD);
    },

    onClickHotlineAction: function() {
        log("Hotline");
        this.handleClickTopbarItem(app.bottomBarButtonType.HOTLINE);
    },

    onClickMessageAction: function() {
        log("Message");
        this.handleClickTopbarItem(app.bottomBarButtonType.MESSAGE);
    },

    onClickUserInfoAction: function() {
        log("UserInfo");
        this.handleClickTopbarItem(app.bottomBarButtonType.USERINFO);
    },

    listenClickTopBarItem: function(cb) {
        this._clickListener = cb;
    },

    // truyen vao button type (xác định đang xử lý sự kiện cho button ).
    handleClickTopbarItem: function(buttonType) {
        log("type: " + buttonType);
        this._clickListener && this._clickListener(buttonType);
    }


    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});