
import app from 'app'
import Component from 'Component'

class TextView extends Component{
    constructor() {
        super();
        this.label = {
            default: null,
            type: cc.Label
        }

        this.maxLine = null
    }

    onLoad(){

    }

    setMaxWidth(maxWith = 150){
        this.label.setContentSize(maxWith, this.label.height);
    }

    setText(text){
        this.label.string = text;
        this._adjustSize();
    }

    _adjustSize(){
        //TODO
    }
}

app.createComponent(TextView)