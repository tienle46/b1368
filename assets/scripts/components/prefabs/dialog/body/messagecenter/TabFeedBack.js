import app from 'app';
import PopupTabBody from 'PopupTabBody';

export default class TabFeedBack extends PopupTabBody {
    constructor() {
        super();

        this.properties = {
            ...this.properties,
            content: cc.EditBox,
        };
    }
    
    onEnable() {
        super.onEnable();
    }
    
    
    _addGlobalListener() {
        super._addGlobalListener();
    }

    _removeGlobalListener() {
        super._removeGlobalListener();
    }
    
    
    onFeedbackConfirmed() {
        let content = this.content.string;
        
        if(content.trim().length > 200) {
            app.system.showToast(app.res.string('error_feedback_too_long'));
            return;
        }
        //collect user feedback and send to server
        if (content && content.trim().length > 0) {
            var sendObject = {
                'cmd': app.commands.SEND_FEEDBACK,
                'data': {
                    [app.keywords.REQUEST_FEEDBACK]: content
                }
            };

            app.service.send(sendObject, (data) => {
                if (data && data["s"]) {
                    this.content.string = "";
                    app.system.showToast(app.res.string('feedback_sent_successfully'));
                } else {
                    app.system.showToast(app.res.string('error_while_sending_feedback'));
                }

            }, app.const.scene.DASHBOARD_SCENE);
        }
        return true;
    }
}

app.createComponent(TabFeedBack);