import app from 'app';

const url = `${app.const.DIALOG_DIR_PREFAB}/topup`;

const tabModels = [
    { title: 'Thẻ cào',prefabPath: `${url}/tab_card`, componentName: 'TabCard'},
    { title: 'SMS',prefabPath: `${url}/tab_sms`, componentName: 'TabSMS', hidden: app.env.isBrowser() ? !app.env.isBrowserTest() : !app.env.isMobile()},
    { title: 'IAP',prefabPath: `${url}/tab_iap`, componentName: 'TabIAP',  hidden: app.env.isBrowser() ? !app.env.isBrowserTest() : !app.env.isMobile()},
    { title: 'Lịch sử',prefabPath: `${url}/tab_history`, componentName: 'TabHistory'}
];

export default class TopUpDialogRub {

   constructor() {
        let node = cc.instantiate(app.res.prefab.multiTabPopup);
        /**
         * @type {MultiTabPopup}
         */
        this.multiTabPopup = node.getComponent("MultiTabPopup");

        this.multiTabPopup.changeToChatTab = this.changeToChatTab.bind(this);
    }

    changeToChatTab(data) {
        this.multiTabPopup && this.multiTabPopup.changeTab(TopUpDialogRub.TAB_CARD, data);
    }

    show(parentNode = cc.director.getScene(), options = {}){
        this.multiTabPopup.show({parentNode, tabModels, ...options});
    }
}

TopUpDialogRub.TAB_CARD = 0;
TopUpDialogRub.TAB_SMS = 1;
TopUpDialogRub.TAB_IAP = 2;
TopUpDialogRub.TAB_HISTORY = 3;