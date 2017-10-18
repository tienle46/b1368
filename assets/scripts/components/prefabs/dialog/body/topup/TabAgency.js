import app from 'app';
import PopupTabBody from 'PopupTabBody';

class TabAgency extends PopupTabBody {
    constructor() {
        super();
        
        this.properties = {
            text: cc.RichText
        }
    }

    onLoad() {
        super.onLoad();
        
        this._renderAgency()
    }
    
    _renderAgency() {
        this.text.string = `<color=#efbb01>Ban quản trị tại Bài 1368 xin được gửi toàn bộ các bài thủ hướng dẫn cách đổi thưởng tại bai1368.com, cách thức đổi thưởng vô cùng thuận tiện và nhanh chóng. Chỉ cần yêu cầu tài khoản thõa mãn những điều kiện dưới đây:</c>
        
    1. Đổi thẻ tự động, không giới hạn cấp độ, không giới hạn hạn mức
    2. Tài khoản đã được xác minh bằng số điện thoại
    3. Tài khoản đã từng nạp thẻ cào vào game
    4. Tài khoản phải còn ít nhất 30.000 Chip sau khi đổi thưởng`
    // 5. Vật phẩm sẽ được chuyển qua đường bưu điện, mọi chi phí vận chuyển do bai1368.com chi trả, giá quy đổi vật phẩm có thể thay đổi theo thời gian.
    }
}

app.createComponent(TabAgency);