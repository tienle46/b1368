const LOGIN_ERROR_MESSAGES = {};
LOGIN_ERROR_MESSAGES["vi"] = {
    "0": "Phiên bản hiện tại của bạn đã quá cũ",
    "1": "Hệ thống đang bảo trì, mời bạn quay lại sau",
    "2": "Sai tên đăng nhập hoặc mật khẩu",
    "3": "Mật khẩu không đúng",
    "4": "Bạn đang bị treo nick, mời bạn quay lại sau",
    "5": "Hệ thống đang quá tải, mời bạn quay lại sau",
    "6": "Bạn đã đang đăng nhập vào hệ thống từ một thiết bị khác",
    "7": "Hệ thống đang quá tải, mời bạn quay lại sau",
    "8": "Hệ thống đang bảo trì, mời bạn quay lại sau",
    "9": "Tên người dùng không hợp lệ",
    "10": "Bạn không được phép đăng nhập vào hệ thống",
    "11": "Bạn đang bị treo nick, mời bạn quay lại sau",
    "28": {
        "0": "Ứng dụng chưa được đăng ký với nhà phát hành game",
        "100": "Lỗi kết nối với hệ thống",
        "101": "Không thể đặng nhập vào hệ thống",
        "102": "Không thể đăng ký tài khoảng với hệ thống",
        "103": "Không thể tìm thấy thông tin tài khoản trong hệ thống",
        "104": "Lỗi hệ thống"
    },
    // CUSTOM ERROR FOR CLIENTS
    "LOGIN_ERROR_USERNAME_NOT_VALID": "Tên đăng nhập phải lớn hơn 5 ký tự, không có ký tự đặc biệt và dấu cách",
    "LOGIN_ERROR_PASSWORD_NOT_VALID": "Mật khẩu mới phải từ 6 ký tự trong đó có ít nhất 1 số, 1 ký tự thường, không có ký tự đặc biệt và dấu cách.",
    "LOGIN_ERROR_CAPTCHA_NOT_VALID": "Mã xác nhận không đúng."
};

module.exports = LOGIN_ERROR_MESSAGES;