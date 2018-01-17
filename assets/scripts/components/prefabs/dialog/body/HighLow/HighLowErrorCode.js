
export default class HighLowErrorCode {
    constructor (code, message) {
        this.code = code;
        this.message = message;
    }
}

HighLowErrorCode.LOCK = new HighLowErrorCode("-1", "Game Cao Thấp tạm khoá");
HighLowErrorCode.UNKNOWN = new HighLowErrorCode("0", "Lỗi không xác định");
HighLowErrorCode.NOT_ENOUGH_JACKPOT_PAY = new HighLowErrorCode("1", "Hũ hết tiền");
HighLowErrorCode.UPDATE_JACKPOT_VALUE_FAIL = new HighLowErrorCode("2", "Không thay đổi được giá trị Jackpot");
HighLowErrorCode.NOT_FOUND_CARDS = new HighLowErrorCode("3", "Không tìm thấy quân bài thích hợp");
HighLowErrorCode.PLAYER_NOT_ENOUGH_MONEY = new HighLowErrorCode("4", "Không đủ tiền chơi tiếp");
HighLowErrorCode.CANNOT_UPDATE_PLAYER_MONEY = new HighLowErrorCode("5", "Lỗi cập nhật tiền trong CSDL");
HighLowErrorCode.INVALID_BET_MONEY = new HighLowErrorCode("6", "Sai mức cược");
HighLowErrorCode.FLOOD_PLAY = new HighLowErrorCode("7", "Thời gian quay quá nhanh");

HighLowErrorCode.SESSION_ALREADY_FINISHED = new HighLowErrorCode("8", "Ván chơi đã kết thúc");
HighLowErrorCode.PLAYER_NOT_PLAY = new HighLowErrorCode("9", "Bạn chưa bắt đầu ván mới hoặc ván chơi đã kết thúc");
HighLowErrorCode.INVALID_PARAMS = new HighLowErrorCode("10", "Lỗi không xác định");
HighLowErrorCode.INVALID_PREDICT = new HighLowErrorCode("11", "Lỗi không xác định");

HighLowErrorCode.valueOf = function(code) {
    switch (code) {
        case HighLowErrorCode.LOCK.code:
            return HighLowErrorCode.LOCK.message;
        case HighLowErrorCode.UNKNOWN.code:
            return HighLowErrorCode.UNKNOWN.message;
        case HighLowErrorCode.NOT_ENOUGH_JACKPOT_PAY.code:
            return HighLowErrorCode.NOT_ENOUGH_JACKPOT_PAY.message;
        case HighLowErrorCode.UPDATE_JACKPOT_VALUE_FAIL.code:
            return HighLowErrorCode.UPDATE_JACKPOT_VALUE_FAIL.message;
        case HighLowErrorCode.NOT_FOUND_CARDS.code:
            return HighLowErrorCode.NOT_FOUND_CARDS.message;
        case HighLowErrorCode.PLAYER_NOT_ENOUGH_MONEY.code:
            return HighLowErrorCode.PLAYER_NOT_ENOUGH_MONEY.message;
        case HighLowErrorCode.CANNOT_UPDATE_PLAYER_MONEY.code:
            return HighLowErrorCode.CANNOT_UPDATE_PLAYER_MONEY.message;
        case HighLowErrorCode.INVALID_BET_MONEY.code:
            return HighLowErrorCode.INVALID_BET_MONEY.message;
        case HighLowErrorCode.FLOOD_PLAY.code:
            return HighLowErrorCode.FLOOD_PLAY.message;
        case HighLowErrorCode.SESSION_ALREADY_FINISHED.code:
            return HighLowErrorCode.SESSION_ALREADY_FINISHED.message;
        case HighLowErrorCode.PLAYER_NOT_PLAY.code:
            return HighLowErrorCode.PLAYER_NOT_PLAY.message;
        case HighLowErrorCode.INVALID_PARAMS.code:
            return HighLowErrorCode.INVALID_PARAMS.message;
        case HighLowErrorCode.INVALID_PREDICT.code:
            return HighLowErrorCode.INVALID_PREDICT.message;
        default:
            return HighLowErrorCode.UNKNOWN.message;
    }
};