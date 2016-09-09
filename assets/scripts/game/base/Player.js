export default class Player {

    constructor(user) {
        this.id = 0,
        this.user = null,
        this.inited = false
    }

    onLoad() {

    }

    update(dt) {

    }

    isOwner() {

    }

    isMaster() {

    }

    setUser(user) {
        this.user = user;
    }

    /**
     * Show message player want to say
     * @param message
     */
    say(message) {

    }

    applyBoardState(boardState) {
        //TODO
    }

    isMe() {

    }

    stopTimeLine() {

    }

    startTimeLine(timeInSeconds) {

    }

    onSpectatorToPlayer(user) {

    }

    onPlayerToSpectator(user) {

    }

    onRejoin(remainCardCount, data) {

    }

    onBoardBegin(data) {

    }

    onBoardStarting(data) {

    }

    onBoardStarted(data) {

    }

    onBoardPlaying(data) {

    }

    onBoardEnd(data) {

    }

    resetReadyState() {

    }

    onBoardMasterChanged(master) {

    }

    onBoardOwnerChanged(owner) {

    }
}

Player.create = (board, user) => {
    var playerClass = game.manager.getPlayerClass(board.gameCode)

    if (playerClass) {
        let player = new playerClass();
        player.init(user);
        return player;
    }
}

module.exports = Player;