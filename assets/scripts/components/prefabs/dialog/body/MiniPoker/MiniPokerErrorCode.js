
export default class MiniPokerErrorCode {
    constructor (code, message) {
        this.code = code;
        this.message = message;
    }
}

MiniPokerErrorCode.UNKNOWN = new MiniPokerErrorCode("0", "Lỗi không xác định");
MiniPokerErrorCode.NOT_ENOUGH_JACKPOT_PAY = new MiniPokerErrorCode("1", "Hũ hết tiền");
MiniPokerErrorCode.UPDATE_JACKPOT_VALUE_FAIL = new MiniPokerErrorCode("2", "Không thay đổi được giá trị Jackpot");
MiniPokerErrorCode.NOT_FOUND_CARDS = new MiniPokerErrorCode("3", "Không tìm thấy bộ bài thích hợp");
MiniPokerErrorCode.PLAYER_NOT_ENOUGH_MONEY = new MiniPokerErrorCode("4", "Không đủ tiền chơi tiếp");
MiniPokerErrorCode.CANNOT_UPDATE_PLAYER_MONEY = new MiniPokerErrorCode("5", "Lỗi cập nhật tiền trong CSDL");
MiniPokerErrorCode.INVALID_BET_MONEY = new MiniPokerErrorCode("6", "Sai mức cược");
MiniPokerErrorCode.FLOOD_PLAY = new MiniPokerErrorCode("7", "Thời gian quay quá nhanh");

MiniPokerErrorCode.valueOf = function(code) {
    switch (code) {
        case MiniPokerErrorCode.UNKNOWN.code:
            return MiniPokerErrorCode.UNKNOWN.message;
        case MiniPokerErrorCode.NOT_ENOUGH_JACKPOT_PAY.code:
            return MiniPokerErrorCode.NOT_ENOUGH_JACKPOT_PAY.message;
        case MiniPokerErrorCode.UPDATE_JACKPOT_VALUE_FAIL.code:
            return MiniPokerErrorCode.UPDATE_JACKPOT_VALUE_FAIL.message;
        case MiniPokerErrorCode.NOT_FOUND_CARDS.code:
            return MiniPokerErrorCode.NOT_FOUND_CARDS.message;
        case MiniPokerErrorCode.PLAYER_NOT_ENOUGH_MONEY.code:
            return MiniPokerErrorCode.PLAYER_NOT_ENOUGH_MONEY.message;
        case MiniPokerErrorCode.CANNOT_UPDATE_PLAYER_MONEY.code:
            return MiniPokerErrorCode.CANNOT_UPDATE_PLAYER_MONEY.message;
        case MiniPokerErrorCode.INVALID_BET_MONEY.code:
            return MiniPokerErrorCode.INVALID_BET_MONEY.message;
        case MiniPokerErrorCode.FLOOD_PLAY.code:
            return MiniPokerErrorCode.FLOOD_PLAY.message;
        default:
            return MiniPokerErrorCode.UNKNOWN.message;
    }
};