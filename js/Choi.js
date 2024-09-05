document.addEventListener('DOMContentLoaded', () => {
    // Hàm lấy tham số từ URL
    function layThamSoURL() {
        const params = new URLSearchParams(window.location.search);
        return {
            cauHinh: params.get('config'),
            loaiTroChoi: params.get('type')
        };
    }

    // Hàm giải mã dữ liệu cấu hình
    function giaiMaCauHinh(cauHinhMaHoa) {
        try {
            const cauHinhGiaiMa = decodeURIComponent(cauHinhMaHoa);
            return JSON.parse(cauHinhGiaiMa);
        } catch (e) {
            console.error('Lỗi giải mã cấu hình:', e);
            return null;
        }
    }

    // Hiển thị cấu hình và loại trò chơi
    function hienThiThongTinCauHinhVaLoaiTroChoi() {
        const thamSo = layThamSoURL();
        const duLieuCauHinh = giaiMaCauHinh(thamSo.cauHinh);
        const loaiTroChoi = thamSo.loaiTroChoi;

        const khuVucHienThiCauHinh = document.getElementById('game-config');
        if (duLieuCauHinh && loaiTroChoi) {
            let cauHinhHTML = '<h2>Thông Tin Cấu Hình</h2><div class="config-row">';
            for (const [vaiTro, soLuong] of Object.entries(duLieuCauHinh)) {
                cauHinhHTML += `
                    <div class="config-item">
                        <span class="role-name">${vaiTro}:</span>
                        <span class="role-count">${soLuong}</span>
                    </div>
                `;
            }
            cauHinhHTML += '</div>';
            cauHinhHTML += `<h2>Loại Trò Chơi</h2><p>${loaiTroChoi}</p>`;
            khuVucHienThiCauHinh.innerHTML = cauHinhHTML;
        } else {
            khuVucHienThiCauHinh.innerHTML = '<p>Không có dữ liệu cấu hình hoặc loại trò chơi.</p>';
        }
    }

    // Thêm hoạt động vào danh sách với màu chữ và nền tùy chỉnh
    function themHoatDong(hoatDong, mauChu, mauNen) {
        const danhSachHoatDong = document.getElementById('activity-list');
        const mucHoatDong = document.createElement('li');
        mucHoatDong.textContent = hoatDong;

        // Cập nhật màu chữ và màu nền
        mucHoatDong.style.color = mauChu;
        mucHoatDong.style.backgroundColor = mauNen;

        danhSachHoatDong.appendChild(mucHoatDong);
    }


    // Hiển thị thông tin phân vai
    function hienThiPhanVai(phanVai) {
        themHoatDong('Thông tin phân vai:', 'var(--button-bg)', 'var(--border-color)');
        phanVai.forEach(nguoiChoi => {
            themHoatDong(`Người chơi số ${nguoiChoi.soThuTu}: ${nguoiChoi.vaiTro}`, 'var(--button-bg)', 'var(--border-color)');
        });
    }

    // Chọn Cảnh sát trưởng ngẫu nhiên nếu có từ 6 người chơi trở lên
    function chonCanhSatTruong(tongSoNguoiChoi) {
        const chiSoCanhSatTruong = Math.floor(Math.random() * tongSoNguoiChoi) + 1; // Random từ 1 đến tổng số người chơi
        themHoatDong(`Người chơi số ${chiSoCanhSatTruong} đã được chọn làm Cảnh sát trưởng.`, 'var(--button-bg)', 'var(--border-color)');
        return chiSoCanhSatTruong; // Trả về số người chơi được chọn
    }

    // Phân phát thẻ nhân vật cho người chơi
    function phanPhatTheNhanVat(duLieuCauHinh) {
        const cacVaiTro = Object.entries(duLieuCauHinh);
        const tatCaVaiTro = cacVaiTro.flatMap(([vaiTro, soLuong]) => Array(soLuong).fill(vaiTro));
        const tongSoVaiTro = tatCaVaiTro.length;

        // Nếu có đủ 6 người chơi trở lên, chọn Cảnh sát trưởng trước
        let chiSoCanhSatTruong = null;
        if (tongSoVaiTro >= 6) {
            chiSoCanhSatTruong = chonCanhSatTruong(tongSoVaiTro);
        }

        // Chọn vai trò cho người chơi số 1
        const chiSoNguoiChoi = 0; // Người chơi mặc định là số 1
        const vaiTroNguoiChoi = tatCaVaiTro[Math.floor(Math.random() * tongSoVaiTro)];

        // Xóa vai trò của người chơi khỏi danh sách thẻ
        tatCaVaiTro.splice(tatCaVaiTro.indexOf(vaiTroNguoiChoi), 1);

        // Trộn ngẫu nhiên các thẻ còn lại cho các máy
        for (let i = tatCaVaiTro.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [tatCaVaiTro[i], tatCaVaiTro[j]] = [tatCaVaiTro[j], tatCaVaiTro[i]];
        }

        // Hiển thị vai trò của người chơi số 1
        themHoatDong(`Vai trò của bạn (người chơi số 1) là: ${vaiTroNguoiChoi}`, 'var(--button-bg)', 'var(--border-color)');

        // Phân phối vai trò cho các người chơi khác
        let soThuTuNguoiChoi = 2;
        const vaiTroConLai = [];
        for (let i = 0; i < tatCaVaiTro.length; i++) {
            vaiTroConLai.push({ soThuTu: soThuTuNguoiChoi, vaiTro: tatCaVaiTro[i] });
            soThuTuNguoiChoi++;
        }

        // Hiển thị vai trò của tất cả người chơi trong console
        console.log([{ soThuTu: chiSoNguoiChoi + 1, vaiTro: vaiTroNguoiChoi }, ...vaiTroConLai]);

        // Xử lý đêm đầu tiên
        themHoatDong('ĐÊM ĐẦU TIÊN', 'var(--text-color)', 'var(--border-color)');
        xuLyDemDauTien(chiSoNguoiChoi, vaiTroNguoiChoi, vaiTroConLai, chiSoCanhSatTruong);
    }

    // Xử lý đêm đầu tiên
    function xuLyDemDauTien(chiSoNguoiChoi, vaiTroNguoiChoi, vaiTroConLai, chiSoCanhSatTruong) {
        // Thêm vai trò của người chơi số 1 vào đầu mảng vaiTroConLai
        vaiTroConLai.unshift({ soThuTu: chiSoNguoiChoi + 1, vaiTro: vaiTroNguoiChoi });

        if (vaiTroNguoiChoi.includes('Sói')) {
            // Hiển thị các sói khác (bỏ qua người chơi số 1)
            const cacSoiKhac = vaiTroConLai
                .filter(moTa => moTa.vaiTro.includes('Sói') && moTa.soThuTu !== chiSoNguoiChoi + 1)
                .map(moTa => moTa.soThuTu);

            themHoatDong('Các sói khác: ' + cacSoiKhac.join(', '), 'var(--button-bg)', 'var(--border-color)');
            themHoatDong('Bạn có thể cắn người chơi khác sau 10s', 'var(--button-bg)', 'var(--border-color)');
            // Thực hiện hành động sau 10 giây
            setTimeout(() => {
                // Người chơi chọn mục tiêu
                const chiSoMucTieu = prompt('Bạn là sói, chọn số người chơi để cắn (1 - ' + vaiTroConLai.length + '):') - 1;

                if (chiSoMucTieu >= 0 && chiSoMucTieu < vaiTroConLai.length) {
                    themHoatDong('Sói đã cắn người chơi số ' + vaiTroConLai[chiSoMucTieu].soThuTu, 'var(--button-bg)', 'var(--border-color)');

                    // Kiểm tra nếu mục tiêu là Cảnh sát trưởng
                    if (vaiTroConLai[chiSoMucTieu].soThuTu === chiSoCanhSatTruong) {
                        themHoatDong('Cảnh sát trưởng đã bị tấn công!', 'var(--button-bg)', 'var(--border-color)');
                    }
                } else {
                    themHoatDong('Lỗi: Số người chơi không hợp lệ.', 'var(--button-bg)', 'var(--border-color)');
                }
            }, 10000); // 10000 milliseconds = 10 seconds
        } else {
            // Sói sẽ tấn công ngẫu nhiên nếu không phải là sói
            const chiSoNgauNhien = Math.floor(Math.random() * vaiTroConLai.length);
            themHoatDong('Sói đã tấn công người chơi số ' + vaiTroConLai[chiSoNgauNhien].soThuTu, 'var(--button-bg)', 'var(--border-color)');

            // Kiểm tra nếu mục tiêu là Cảnh sát trưởng
            if (vaiTroConLai[chiSoNgauNhien].soThuTu === chiSoCanhSatTruong) {
                themHoatDong('Cảnh sát trưởng đã bị tấn công!', 'var(--button-bg)', 'var(--border-color)');
            }
        }
    }

    // Gọi các hàm để hiển thị thông tin và phân vai
    const thamSo = layThamSoURL();
    const duLieuCauHinh = giaiMaCauHinh(thamSo.cauHinh);
    if (duLieuCauHinh) {
        hienThiThongTinCauHinhVaLoaiTroChoi();
        phanPhatTheNhanVat(duLieuCauHinh);
    }
});
