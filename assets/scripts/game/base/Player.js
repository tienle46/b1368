
import game from 'game'

export default class Player {

    constructor(board, user) {
        this.playerNameLabel = {
            default: null,
            type: cc.Label
        }

        this.balanceLabel = {
            default: null,
            type: cc.Label
        }

        this.id = 0
        this.user = user
        this.board = board
        this.inited = false
    }

    onLoad() {

        console.log("On Load Player")
        console.debug(this.node)

        let nameNode = this.node.getChildByName('name')
        this.playerNameLabel = nameNode && nameNode.getComponent(cc.Label)

        let balanceNode = this.node.getChildByName('balance')
        this.balanceLabel = cc.find('balance/balanceText', this.node).getComponent(cc.Label);//balanceNode && balanceNode.getChil('balanceText').getComponent(cc.Label)

        this.playerNameLabel.string = this.user.name;
        this.balanceLabel.string = `${this._getPlayerBalance()}`;
    }

    _getPlayerBalance(){
        return this.user.variables[game.keywords.USER_VARIABLE_BALANCE].value || 0
    }

    update(dt) {

    }

    _onUpdate(){
        console.debug("Player parent")
        console.debug(this.parent)
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

    isItMe() {
        return this.user && this.user.isItMe
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