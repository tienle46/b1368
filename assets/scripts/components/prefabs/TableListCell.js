import app from 'app'
import Component from 'Component'
import ClickEvent from 'ClickEvent'

class TableListCell extends Component{
    constructor() {

        super();

        this.numberCoinLabel = {
            default: null,
            type: cc.Label
        }

        this.levelBkg = {
            default: null,
            type: cc.Sprite
        }

        this.levelHighlight = {
            default: null,
            type: cc.Sprite
        }

        this.levelPercentLabel = {
            default: null,
            type: cc.Label
        }

        this.lockIcon = {
            default: null,
            type: cc.Sprite
        }

        this._onClickListener = null
    }

    onLoad(){

    }

    setOnClickListener(clickListener){
        this._onClickListener = clickListener instanceof Function && clickListener
    }

    onClickEvent(){
        console.log("on click event")
        this._onClickListener && this._onClickListener();
    }
}

app.createComponent(TableListCell)