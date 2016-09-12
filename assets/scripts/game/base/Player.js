
import game from 'game'
import Component from 'Component'
import utils from 'utils'

export default class Player {

    constructor(board, user) {
        console.log(board)
        console.log(user)

        this.playerNameLabel = {
            default: null,
            type: cc.Label,
            visible: true
        }

        this.balanceLabel = {
            default: null,
            type: cc.Label,
            visible: true
        }

        this.status1 = {
            default: null,
            type: cc.Node,
            visible: false
        }

        this.status2 = {
            default: null,
            type: cc.Node,
            visible: false
        }

        this.ownerNode = {
            default: null,
            type: cc.Node,
            visible: false
        }

        this.id = 0
        this.user = user
        this.board = board
        this.inited = false

        this._init();
    }

    _init(){
        this.id = this.user && this.user.getPlayerId(this.board.room)
        this.balance = this._getUserVariable(game.keywords.USER_VARIABLE_BALANCE, 0)
        this.username = this.user && this.user.name
    }

    _initComponent(){
        let nameNode = this.node.getChildByName('name')
        this.playerNameLabel = nameNode && nameNode.getComponent(cc.Label)

        let balanceNode = this.node.getChildByName('balance')
        this.balanceLabel = cc.find('balance/balanceText', this.node).getComponent(cc.Label);//balanceNode && balanceNode.getChil('balanceText').getComponent(cc.Label)

        this.status1 = cc.find('status/status1', this.node);
        this.status2 = cc.find('status/status2', this.node);
        this.ownerNode = this.node.getChildByName('owner')

        utils.gone(this.status1);
        utils.gone(this.status2);
        utils.gone(this.ownerNode);
    }

    onLoad() {
        this._initComponent();

        this.playerNameLabel.string = this.user.name;
        this.balanceLabel.string = `${this.balance}`;

        utils.setVisible(this.ownerNode, this.isOwner())
    }

    _getUserVariable(key, defaultValue){
        return this.user && this.user.containsVariable(key) && this.user.variables[key].value || defaultValue
    }

    update(dt) {

    }

    _onUpdate(){
        console.debug("Player parent")
        console.debug(this.parent)
    }

    isOwner() {
        return this.id === this.board.ownerId
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