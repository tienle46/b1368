import app from 'app';
import Component from 'Component';

class HistoryItem extends Component {

    constructor() {
        super();

        this.verticalLayout = {
            default : null,
            type: cc.Layout
        }

        this.descriptionLabel = {
            default : null,
            type: cc.Label
        }
        this.toggleButton = {
            default : null,
            type: cc.Button
        }
        this.resizeRequired = false;
    }

    onLoad(){
        // this.descriptionLabel.node.on('active-in-hierarchy-changed', ()=>{
        //     console.log(`active changed`);
        // });

        const toggleEventHandle = new cc.Component.EventHandler();
        toggleEventHandle.target = this.node;
        toggleEventHandle.component = HistoryItem.name;
        toggleEventHandle.handler = "toggleClicked";

        this.toggleButton.clickEvents = [toggleEventHandle];

        // this.descriptionLabel.node.active = true;
    }

    toggleClicked(sender, event) {

        this.descriptionLabel.node.active = !this.descriptionLabel.node.active;

        //change height node to display additional information

    }
    update(){
        if(this.resizeRequired){
            this.node.runAction(cc.callFunc(()=>{
                this.node.height = this.verticalLayout.node.height;
            }))
            this.resizeRequired = false;
        }
        if(this.verticalLayout._layoutDirty){
            this.resizeRequired = true;
        }
    }

}
app.createComponent(HistoryItem);