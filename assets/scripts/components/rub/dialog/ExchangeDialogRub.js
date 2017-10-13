import app from 'app';

const url = `${app.const.DIALOG_DIR_PREFAB}/exchange`;
const tabModels = [
    { title: 'Thẻ cào',prefabPath: `${url}/tab_exchange_card`, componentName: 'TabExchangeCard'},
    { title: 'Vật phẩm',prefabPath: `${url}/tab_exchange_item`, componentName: 'TabExchangeItem'},
    { title: 'Lịch sử',prefabPath: `${url}/tab_exchange_history`, componentName: 'TabExchangeHistory'},
    { title: 'Đại lý',prefabPath: `${url}/tab_agency`, componentName: 'TabAgency'}
];

export default class ExchangeDialogRub {

    constructor() {
        let node = cc.instantiate(app.res.prefab.multiTabPopup);
        /**
         * @type {MultiTabPopup}
         */
        this.multiTabPopup = node.getComponent("MultiTabPopup");
    }
    
    show(parentNode = cc.director.getScene(), options = {}){
        this.multiTabPopup.show(Object.assign({}, {parentNode, tabModels}, options));
    }
}

ExchangeDialogRub.TAB_EXCHANGE_CARD_INDEX = 0;
ExchangeDialogRub.TAB_EXCHANGE_ITEM_INDEX = 1;
ExchangeDialogRub.TAB_EXCHANGE_HISTORY_INDEX = 2;
ExchangeDialogRub.TAB_EXCHANGE_AGENCY_INDEX = 3;