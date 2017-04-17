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
        this._data = null;
        
        this.multiTabPopup = node.getComponent("MultiTabPopup");
    }
    
    changeToTab(tabIndex, data) {
        this.multiTabPopup && this.multiTabPopup.changeTab(tabIndex);
        this._data = data;
    }
    
    show(parentNode = cc.director.getScene(), options = {}){
        let initData = this._data;
        this.multiTabPopup.show({parentNode, tabModels, initData, ...options});
    }
}

PersonalInfoDialogRub.TAB_USER_INFO_INDEX = 0;
PersonalInfoDialogRub.TAB_USER_ACHIEVEMENTS_INDEX = 1;
PersonalInfoDialogRub.TAB_USER_BANK_INDEX = 2;