
var MiniPokerCardType = module.exports;

MiniPokerCardType.THUA = 0;
MiniPokerCardType.DOI_J = 1;
MiniPokerCardType.HAI_DOI = 2;
MiniPokerCardType.SAM = 3;
MiniPokerCardType.SANH = 4;
MiniPokerCardType.THUNG = 5;
MiniPokerCardType.CU_LU = 6;
MiniPokerCardType.TU_QUY = 7;
MiniPokerCardType.THUNG_PHA_SANH = 8;
MiniPokerCardType.THUNG_PHA_SANH_J = 9;

MiniPokerCardType.getNameForType = function(type) {
    switch (type) {
        case MiniPokerCardType.DOI_J:
            return 'Đôi J';
        case MiniPokerCardType.HAI_DOI:
            return 'Hai đôi';
        case MiniPokerCardType.SAM:
            return 'Sâm';
        case MiniPokerCardType.SANH:
            return 'Sảnh';
        case MiniPokerCardType.THUNG:
            return 'Thùng';
        case MiniPokerCardType.CU_LU:
            return 'Cù lũ';
        case MiniPokerCardType.TU_QUY:
            return 'Tứ quý';
        case MiniPokerCardType.THUNG_PHA_SANH:
            return 'Thùng phá sảnh';
        case MiniPokerCardType.THUNG_PHA_SANH_J:
            return 'Thùng phá sảnh J';
        default:
            return 'Bài cao';
    }
};