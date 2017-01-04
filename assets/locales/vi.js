export default {
    system: "Hệ Thống",
    game_title: "B1368",
    change_language_fail: "Đổi ngôn ngữ thất bại",
    invalid_play_card: "Bài không hợp lệ",
    coming_soon: "Chức năng đang hoàn thiện!",
    error_system: 'Lỗi hệ thống',
    error_not_support_game: "Game không được hỗ trợ",
    error_fail_to_create_game: "Không thể khởi tạo bàn chơi",
    error_fail_to_load_game_data: "Không thể tải dữ liệu bàn chơi",
    error_user_enter_empty_input: "Vui lòng nhập đầy đủ thông tin",
    error_user_not_enough_gold_to_join_room: "Phòng chơi có mức cược {{minBet}}, bạn hiện tại không đủ điều kiện để tham gia",
    error_topup_dialog_need_to_choice_item: "Vui lòng chọn loại thẻ",
    error_exchange_dialog_need_to_choice_item: "Chưa chọn loại phần thưởng",
    error_exchange_dialog_not_enough_money: "Số tiền hiện tại {{ownerCoin}} không đủ để đổi vật phẩm {{name}}",
    error_phone_number_is_invalid: 'Số điện thoại không hợp lệ',
    exchange_dialog_confirmation: 'Bạn có muốn đổi {{gold}} chip để nhận {{name}} ?',
    really_wanna_quit: 'Bạn có chắc chắn muốn thoát ?',
    phone_number_confirmation: 'Xác nhận số điện thoại thành công.',
    user_got_invitation_to_join_room: '{{invoker}}  muốn mời bạn vào phòng chơi {{minBet}} xu.',
    game_heo_den: 'heo đen',
    game_heo_do: 'heo đỏ',
    game_ba_doi_thong: '3 đôi thông',
    game_bon_doi_thong: '4 đôi thông',
    game_tu_quy: 'tứ quý',
    game_ba_bich: '3 bích',
    game_thoi: 'Thối',
    game_waiting_time: 'Thời gian chờ',
    game_waiting: 'Chờ',
    game_start: 'Bắt đầu',
    game_replay_waiting_time: 'Ván mới',
    label_accept: 'Đồng ý',
    label_deny: 'Hủy',
    label_close: 'Đóng',
    random_invite_player_successfully: 'Lời mời vào bàn chơi đã được gửi đi',
    error_cannot_load_data: 'Không thể tải dữ liệu',
    loading_data: 'Đang tải dữ liệu...',
    game_table_name: 'Bàn {{tableName}}',
    game_sam_thang_sam: 'Thắng Sâm',
    game_sam_den_sam: 'Đền Sâm',
    game_sam_den_thoi_heo: 'Đền Thối Heo',
    game_sam_treo: 'Treo',
    game_thua: 'Thua',
    game_thang: 'Thắng',
    game_result_card_count: '{{count}} lá',
    game_bet_time: 'Đặt cược',
    game_down_card_time: 'Hạ bài',
    game_bacay_sap: 'Sáp',
    game_result_bacay_point: '{{point}} nước',
    game_result_bacay_10_point: 'Mười nước',
    game_result_bacay_tit: 'Tịt...',
    game_result_bacay_nai: 'Nái...',
    game_result_bacay_nua_doi: 'Nửa đời',
    game_bacay_cuoc_bien: 'Cược biên',
    game_bacay_cuop_chuong: 'Cướp chương',
    game_bacay_ask_to_accept_cuoc_bien: '{{player}} muốn CƯỢC BIÊN với bạn {{value}}$',
    game_bacay_chi_cuoc_bien_mot_lan: 'Chỉ được cược biên với người chơi một lần',
    game_bacay_khong_the_cuoc_bien: 'Bạn không thể cược biên với người chơi này',
    game_registered_quit_room: 'Đăng ký rời bàn thành công',
    game_start_deal_card: 'Bắt đầu \nchia bài',
    game_change_master_to_player: 'Chuyển chương cho người chơi {{playerName}}',
    game_bet: 'Cược',
    game_down_card: 'Hạ bài',
    game_not_enough_balance_to_cuoc_bien: 'Tài khoản không đủ để Cược Biên',
    game_not_enough_balance_to_bet: 'Tài khoản không đủ để tiếp tục Cược',
    game_phom_u: 'Ù',
    game_phom_u_den: 'ù đền',
    game_phom_u_khan: 'ù khan',
    game_phom_u_phom_kin: 'u phỏm kín',
    game_phom_u_tron: 'ù tròn',
    game_phom_mom: 'móm',
    game_nhat: 'nhất',
    game_nhi: 'nhì',
    game_ba: 'ba',
    game_bet: 'bét',
    game_point: '{{point}} điểm',
};
//
// if (playersWinRank == app.const.game.rank.GAME_RANK_FIRST) {
//     switch (winType) {
//         case app.const.game.PHOM_WIN_TYPE_U_THUONG:
//             resultIconPaths[id] = 'game/images/ingame_phom_u';
//             break;
//         case app.const.game.PHOM_WIN_TYPE_U_DEN:
//             resultIconPaths[id] = 'game/images/ingame_phom_u_den';
//             break;
//         case app.const.game.PHOM_WIN_TYPE_U_KHAN:
//             resultIconPaths[id] = 'game/images/ingame_phom_u_khan';
//             break;
//         case app.const.game.PHOM_WIN_TYPE_U_TRON:
//             resultIconPaths[id] = 'game/images/ingame_phom_u_tron';
//             break;
//         case app.const.game.PHOM_WIN_TYPE_U_PHOM_KIN:
//             resultIconPaths[id] = 'game/images/ingame_phom_u_phom_kin';
//             break;
//         default:
//             resultIconPaths[id] = 'game/images/ingame_thang';
//     }
// } else {
//     if(isMom){
//         resultIconPaths[id] = 'game/images/ingame_phom_mom';
//     }else{
//         switch (playersWinRank) {
//             case app.const.game.GAME_RANK_SECOND:
//                 resultIconPaths[id] = 'game/images/ingame_nhi';
//                 break;
//             case app.const.game.GAME_RANK_THIRD:
//                 resultIconPaths[id] = 'game/images/ingame_ba';
//                 break;
//             case app.const.game.GAME_RANK_FOURTH:
//                 resultIconPaths[id] = 'game/images/ingame_bet';
//                 break;
//             default:
//                 resultIconPaths[id] = 'game/images/ingame_thua';
//         }
//     }
// }
//
// let player = this.scene.gamePlayers.findPlayer(id);
// if(player){
//     let handCards = playerHandCards[id];
//     let point = handCards.reduce((value, card) => value += card.rank, 0);
//     gameResultInfos[id] = isMom && winType != app.const.game.GENERAL_WIN_TYPE_NORMAL ? "" : `${point} điểm`;