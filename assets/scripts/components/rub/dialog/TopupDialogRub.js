import app from 'app';

export default class TopupDialogRub {

   constructor() {
        let node = cc.instantiate(app.res.prefab.multiTabPopup);
        /**
         * @type {MultiTabPopup}
         */
        this.multiTabPopup = node.getComponent("MultiTabPopup");

        this.multiTabPopup.changeToChatTab = this.changeToChatTab.bind(this);
        const url = `${app.const.DIALOG_DIR_PREFAB}/topup`;

        this.tabModels = [
            { title: 'Thẻ cào',prefabPath: `${url}/tab_card`, componentName: 'TabCard'},
            { title: 'SMS',prefabPath: `${url}/tab_sms`, componentName: 'TabSMS'},
            { title: 'IAP',prefabPath: `${url}/tab_iap`, componentName: 'TabIAP',  hide: app.env.isBrowser()},
            { title: 'Lịch sử',prefabPath: `${url}/tab_history`, componentName: 'TabHistory'}
        ];
    }
    
    changeToChatTab(data) {
        this.multiTabPopup && this.multiTabPopup.changeTab(TopupDialogRub.TAB_CARD_INDEX, data);
    }   
     
    show(parentNode = cc.director.getScene(), options = {}){
        this.multiTabPopup.show(Object.assign({}, {parentNode, tabModels: this.tabModels}, options));
    }
}

TopupDialogRub.TAB_CARD_INDEX = 0;
TopupDialogRub.TAB_SMS_INDEX = 1;
TopupDialogRub.TAB_IAP_INDEX = 2;
TopupDialogRub.TAB_HISTORY_INDEX = 3;