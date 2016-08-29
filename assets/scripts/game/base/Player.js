var Player = cc.Class({
    extends: cc.Component,

    properties: {
        id: 0,
        user: null,
        inited: false
    },

    init(user){
        //TODO

        this.inited = true;
    },

    onLoad() {

    },

    update(dt) {

    },

    isOwner(){

    },

    isMaster(){

    },

    setUser(user){
        this.user = user;
    },

    /**
     * Show message player want to say
     * @param message
     */
    say(message){

    },

    applyBoardState(boardState){
        //TODO
    },

    isMe(){

    },

    stopTimeLine(){

    },

    startTimeLine(timeInSeconds){

    },

    onSpectatorToPlayer(user){

    },

    onPlayerToSpectator(user){

    },

    onRejoin(remainCardCount, data){

    },

    onBoardBegin(data){

    },

    onBoardStarting(data){

    },

    onBoardStarted(data){

    },

    onBoardPlaying(data){

    },

    onBoardEnd(data){

    },

    resetReadyState(){

    },

    onBoardMasterChanged(master){

    },

    onBoardOwnerChanged(owner){

    }

});

Player.create = (board, user) => {
    var playerClass = game.manager.getPlayerClass(board.gameCode)

    if (playerClass) {
        let player = new playerClass();
        player.init(user);
        return player;
    }
}

module.exports = Player;