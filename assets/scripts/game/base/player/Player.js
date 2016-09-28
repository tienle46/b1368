
import app from 'app';
import utils from 'utils';
import CreateGameException from 'CreateGameException';
import Actor from 'Actor';
import Events from 'Events'

export default class Player extends Actor {

    constructor(board, user) {
        super();

        this._inited;

        this.id = 0;
        this.user = user;
        this.board = board;
        this.inited = false;
        this.isOwner = false;
        this.isMaster = false;
        this.ready = false;
    }

    _init(board, user){

        this.board = board;
        this.user = user;

        if(!this.board || !this.user){
            throw new CreateGameException("Dữ liệu khởi tạo bàn chơi không đúng");
        }

        this.username = this.user.name;
        this.id = this.user.getPlayerId(this.board.room);
        this.balance = utils.getVariable(this.user, app.keywords.USER_VARIABLE_BALANCE, 0);

        this.board.scene.on(Events.ON_GAME_STATE_BEGIN, this.onGameBegin, this);
        this.board.scene.on(Events.ON_GAME_STATE_STARTING, this.onGameStarting, this);
        this.board.scene.on(Events.ON_GAME_STATE_STARTED, this.onGameStarted, this);
        this.board.scene.on(Events.ON_GAME_STATE_PLAYING, this.onGamePlaying, this);
        this.board.scene.on(Events.ON_GAME_STATE_ENDING, this.onGameEnding, this);
        this.board.scene.on(Events.GAME_USER_EXIT_ROOM, this._onUserExitRoom, this);
    }

    _onUserExitRoom(user, room){
        if(user.id = this.user.id){
            this.stopTimeLine();
        }
    }

    onLoad(){
        super.onLoad();

        this.renderer.setName(this.username);
        this.renderer.setBalance(this.balance);
        this.renderer.setVisibleOwner(this.isOwner);
        
        console.log("on load: ", this.username, this.id, this.board, this.board.room);
    }

    setOwner(isOwner){
        this.isOwner = isOwner;
        this.renderer.setVisibleOwner(isOwner);
    }

    setMaster(isMaster){
        this.isMaster = isMaster;
        this.renderer.setVisibleMaster(isMaster);
    }

    setReady(ready){
        this.ready = ready;
        this.renderer.setVisibleReady(this.ready);
    }

    resetReadyState() {
        this.setReady(false);
    }

    isItMe() {
        return this.user && this.user.isItMe;
    }

    /**
     * Show message player want to say
     * @param message
     */
    say(message) {
        alert(`${this.name}: ${message}`);
    }

    notify(message){
        alert(`${this.name}: ${message}`);
    }

    stopTimeLine() {
        //TODO
    }

    startTimeLine(timeInSeconds = this.board.getTurnDuration()) {
        //TODO
    }

    onSpectatorToPlayer(user) {

    }

    onPlayerToSpectator(user) {

    }

    onRejoin(remainCardCount, data) {

    }

    changeGameState(gameState){

    }

    onGameInitiated(data) {

    }

    onGameBegin(data) {

    }

    onGameStarting(data) {

    }

    onGameStarted(data) {

    }

    onGamePlaying(data) {

    }

    onGameEnding(data) {

    }

}

app.createComponent(Player);