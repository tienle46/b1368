import app from 'app';

const url = `${app.const.DIALOG_DIR_PREFAB}/userinfo`;

const tabModels = [
    { title: 'Cá nhân',prefabPath: `${url}/tab_user_info`, componentName: 'TabUserInfo'},
    { title: 'Thành tích',prefabPath: `${url}/tab_user_achievements`, componentName: 'TabUserAchievements'},
    { title: 'Ngân hàng',prefabPath: `${url}/tab_user_bank`, componentName: 'TabUserBank'}
     // , {
     //     title: 'Gift Code',
     //     value: `${url}/tab_gift_code`
     // }
     // , {
     //     title: 'Chuyển chip',
     //     value: 'tab_transfer_vc'
     // }, {
     //     title: 'Nhận chip',
     //     value: 'tab_transfer_transaction'
     // },
];

export default class PersonalInfoDialogRub {

    constructor() {
        let node = cc.instantiate(app.res.prefab.multiTabPopup);
        /**
         * @type {MultiTabPopup}
         */
        this.multiTabPopup = node.getComponent("MultiTabPopup");

        this.multiTabPopup.changeToChatTab = this.changeToChatTab.bind(this);
    }

    changeToChatTab(data) {
        this.multiTabPopup && this.multiTabPopup.changeTab(TopRankDialogRub.TAB_USER_INFO, data);
    }

    show(parentNode = cc.director.getScene(), options = {}){
        this.multiTabPopup.show({parentNode, tabModels, ...options});
    }
}

PersonalInfoDialogRub.TAB_USER_INFO = 0;
PersonalInfoDialogRub.TAB_USER_ACHIEVEMENTS = 1;
PersonalInfoDialogRub.TAB_USER_BANK = 2;