<<<<<<< HEAD
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
=======
document.addEventListener('DOMContentLoaded', () => {
    let chiSoNguoiChoi = 0; 
    let vaiTroNguoiChoi = null;
    let chiSoCanhSatTruong = null;
    let dsNguoiChoi = []; // Danh sách tất cả người chơi
    let dsNguoiChoiConSong = [];
    let dsNguoiChoiBiLoai = [];
    let dsSongCon = [];
    let dsLoaiMoiDem = [];
    let thamSo = layThamSoURL();
    let duLieuCauHinh = giaiMaCauHinh(thamSo.cauHinh);
    // let loaiTroChoi = thamSo.loaiTroChoi;

    function layThamSoURL() {
        const params = new URLSearchParams(window.location.search);
        return {
            cauHinh: params.get('config'),
            // loaiTroChoi: params.get('type')
        };
    }

    function giaiMaCauHinh(cauHinhMaHoa) {
        try {
            const cauHinhGiaiMa = decodeURIComponent(cauHinhMaHoa);
            return JSON.parse(cauHinhGiaiMa);
        } catch (e) {
            console.error('Lỗi giải mã cấu hình:', e);
            return null;
        }
    }

    function hienThiThongTinCauHinhVaLoaiTroChoi() {
        const khuVucHienThiCauHinh = document.getElementById('game-config');
        if (duLieuCauHinh) {
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
            // cauHinhHTML += `<h2>Loại Trò Chơi</h2><p>${loaiTroChoi}</p>`;
            khuVucHienThiCauHinh.innerHTML = cauHinhHTML;
        } else {
            khuVucHienThiCauHinh.innerHTML = '<p>Không có dữ liệu cấu hình hoặc loại trò chơi.</p>';
        }
    }

    function themHoatDong(hoatDong, mauChu, mauNen) {
        const danhSachHoatDong = document.getElementById('activity-list');
        const mucHoatDong = document.createElement('li');
        mucHoatDong.textContent = hoatDong;
        mucHoatDong.style.color = mauChu;
        mucHoatDong.style.backgroundColor = mauNen;
        danhSachHoatDong.appendChild(mucHoatDong);
    }

    function phanPhatTheNhanVat(duLieuCauHinh) {
        const cacVaiTro = Object.entries(duLieuCauHinh);
        const tatCaVaiTro = cacVaiTro.flatMap(([vaiTro, soLuong]) => Array(soLuong).fill(vaiTro));
        const tongSoVaiTro = tatCaVaiTro.length;
        
        if (tongSoVaiTro >= 6) {
            chiSoCanhSatTruong = chonCanhSatTruong(tongSoVaiTro);
        }
        
        vaiTroNguoiChoi = tatCaVaiTro[Math.floor(Math.random() * tongSoVaiTro)];
        tatCaVaiTro.splice(tatCaVaiTro.indexOf(vaiTroNguoiChoi), 1);
        
        dsNguoiChoi.push({
            soThuTu: chiSoNguoiChoi + 1,
            vaiTro: vaiTroNguoiChoi
        });
        dsNguoiChoiConSong.push({
            soThuTu: chiSoNguoiChoi + 1,
            vaiTro: vaiTroNguoiChoi
        });
        
        let soThuTuNguoiChoi = 2;
        while (tatCaVaiTro.length > 0) {
            const vaiTro = tatCaVaiTro.pop();
            dsNguoiChoi.push({
                soThuTu: soThuTuNguoiChoi,
                vaiTro: vaiTro
            });
            dsNguoiChoiConSong.push({
                soThuTu: soThuTuNguoiChoi,
                vaiTro: vaiTro
            });
            soThuTuNguoiChoi++;
        }
        dsSongCon = Array(dsNguoiChoi.length).fill(1);
        
        themHoatDong(`Vai trò của bạn (người chơi số 1) là: ${vaiTroNguoiChoi}`, 'var(--button-bg)', 'var(--border-color)');
        console.log(dsNguoiChoi);
    }

    function chonCanhSatTruong(tongSoNguoiChoi) {
        chiSoCanhSatTruong = Math.floor(Math.random() * tongSoNguoiChoi) + 1;
        themHoatDong(`Người chơi số ${chiSoCanhSatTruong} đã được chọn làm Cảnh sát trưởng.`, 'var(--button-bg)', 'var(--border-color)');
        return chiSoCanhSatTruong;
    }

    function tromThe(){

    }

    function ghepDoi() {
        if (dsNguoiChoiConSong.some(player => player.vaiTro === 'Cupid')) {
            if (vaiTroNguoiChoi === 'Cupid') {
                let selectedPlayers = [];
                while (selectedPlayers.length < 2) {
                    const chiSoNguoiChoi = prompt(`Chọn số người chơi để ghép đôi (1 - ${dsNguoiChoiConSong.length}):`);
                    const index = parseInt(chiSoNguoiChoi) - 1;
    
                    if (index >= 0 && index < dsNguoiChoiConSong.length && !selectedPlayers.includes(dsNguoiChoiConSong[index])) {
                        selectedPlayers.push(dsNguoiChoiConSong[index]);
                    } else {
                        alert('Số người chơi không hợp lệ hoặc đã được chọn.');
                    }
                }
    
                selectedPlayers.forEach(player => {
                    player.isCoupled = true;
                });
    
                themHoatDong(`Cupid đã ghép đôi người chơi số ${selectedPlayers[0].soThuTu} và người chơi số ${selectedPlayers[1].soThuTu}`, 'var(--button-bg)', 'var(--border-color)');
            } else {
                let randomIndexes = [];
                while (randomIndexes.length < 2) {
                    let randomIndex = Math.floor(Math.random() * dsNguoiChoiConSong.length);
                    if (!randomIndexes.includes(randomIndex)) {
                        randomIndexes.push(randomIndex);
                    }
                }
    
                let player1 = dsNguoiChoiConSong[randomIndexes[0]];
                let player2 = dsNguoiChoiConSong[randomIndexes[1]];
    
                player1.isCoupled = true;
                player2.isCoupled = true;
    
                themHoatDong(`Cupid đã ghép đôi ngẫu nhiên ${player1.soThuTu} và ${player2.soThuTu}`, 'var(--button-bg)', 'var(--border-color)');
            }
        }
    }
    
    

    function soiTanCong() {
        if (vaiTroNguoiChoi.includes('Sói')) {
            const cacSoiKhac = dsNguoiChoiConSong
                .filter(nguoiChoi => nguoiChoi.vaiTro.includes('Sói') && nguoiChoi.soThuTu !== chiSoNguoiChoi + 1)
                .map(nguoiChoi => nguoiChoi.soThuTu);

            themHoatDong('Các sói khác: ' + cacSoiKhac.join(', '), 'var(--button-bg)', 'var(--border-color)');
            themHoatDong('Bạn có thể cắn người chơi khác sau 10s', 'var(--button-bg)', 'var(--border-color)');
            
            setTimeout(() => {
                const chiSoMucTieu = prompt('Bạn là sói, chọn số người chơi để cắn (1 - ' + dsNguoiChoiConSong.length + '):') - 1;

                if (chiSoMucTieu >= 0 && chiSoMucTieu < dsNguoiChoiConSong.length) {
                    const nguoiChoiBiCan = dsNguoiChoiConSong.splice(chiSoMucTieu, 1)[0];
                    dsNguoiChoiBiLoai.push(nguoiChoiBiCan);
                    dsSongCon[chiSoMucTieu] = 0;
                    themHoatDong('Sói đã cắn người chơi số ' + nguoiChoiBiCan.soThuTu, 'var(--button-bg)', 'var(--border-color)');
                } else {
                    themHoatDong('Lỗi: Số người chơi không hợp lệ.', 'var(--button-bg)', 'var(--border-color)');
                }
            }, 10000);
        } else {
            const chiSoNgauNhien = Math.floor(Math.random() * dsNguoiChoiConSong.length);
            const nguoiChoiBiCan = dsNguoiChoiConSong.splice(chiSoNgauNhien, 1)[0];
            dsNguoiChoiBiLoai.push(nguoiChoiBiCan);
            dsLoaiMoiDem.push(nguoiChoiBiCan);
            dsSongCon[chiSoNgauNhien] = 0;
            themHoatDong('Sói đã tấn công người chơi số ' + nguoiChoiBiCan.soThuTu, 'var(--button-bg)', 'var(--border-color)');
        }
    }

    function nhinTromSoi(){

    }

    function baoVe() {
        if (dsNguoiChoi.some(player => player.vaiTro === 'Bảo vệ')) {
            if (vaiTroNguoiChoi === 'Bảo vệ') {
                const selectedPlayerIndex = prompt(`Chọn số người chơi để bảo vệ (1 - ${dsNguoiChoi.length}):`);
                const index = parseInt(selectedPlayerIndex) - 1;
    
                if (index >= 0 && index < dsNguoiChoi.length) {
                    const protectedPlayer = dsNguoiChoi[index];
                    protectedPlayer.isProtected = true;
                    dsSongCon[index] = 1;
                    themHoatDong(`Bảo vệ đã bảo vệ người chơi số ${protectedPlayer.soThuTu}`, 'var(--button-bg)', 'var(--border-color)');
                } else {
                    themHoatDong('Lỗi: Số người chơi không hợp lệ.', 'var(--button-bg)', 'var(--border-color)');
                }
            } else {
                const randomIndex = Math.floor(Math.random() * dsNguoiChoi.length);
                const protectedPlayer = dsNguoiChoi[randomIndex];
                protectedPlayer.isProtected = true;
                dsSongCon[randomIndex] = 1;
                themHoatDong(`Bảo vệ đã bảo vệ người chơi số ${protectedPlayer.soThuTu}`, 'var(--button-bg)', 'var(--border-color)');
            }
        }
    }
    
    function suDungThuoc(){

    }

    function soiMaSoi(){

    }

    function chonNguoiChetTheo(){

    }
    
    function canSoiThuong(){

    }

    function demDauTien() {
        themHoatDong('ĐÊM ĐẦU TIÊN', 'var(--text-color)', 'var(--border-color)');
        tromThe();
        ghepDoi();
        nhinTromSoi();
        soiTanCong();
        baoVe();
        suDungThuoc();
        soiMaSoi();
        chonNguoiChetTheo();
        canSoiThuong();
    }
    
    function demNguoiBiLoai(){
        if(dsSongCon.filter(num => num === 0).length > 0){
            themHoatDong('Đêm qua là 1 đêm kinh hoàng! Có '+dsLoaiMoiDem.length+ ' người chơi bị chết!', 'var(--button-bg)', 'var(--border-color)');
        }else{
            themHoatDong('Đêm qua là 1 đêm yên bình vì không ai bị chết!', 'var(--button-bg)', 'var(--border-color)');
        }
    }

    function banLuan() {
        themHoatDong('Thời gian bàn luận (30s)', 'var(--button-bg)', 'var(--border-color)');
        
        setTimeout(() => {
            themHoatDong('Thời gian bàn luận đã kết thúc!', 'var(--button-bg)', 'var(--border-color)');
            boPhieu();  
        }, 3000);
    }
    
    function boPhieu() {
        themHoatDong('Thời gian bỏ phiếu (30s)', 'var(--button-bg)', 'var(--border-color)');
        
        setTimeout(() => {
            themHoatDong('Thời gian bỏ phiếu đã kết thúc!', 'var(--button-bg)', 'var(--border-color)');
            treoCo();  
        }, 3000);
    }
    
    function treoCo() {
        themHoatDong('Người chơi số ' + 2 + ' đã bị treo cổ', 'var(--button-bg)', 'var(--border-color)');
    }
    
    function ngayDauTien() {
        themHoatDong('NGÀY ĐẦU TIÊN', 'var(--text-color)', 'var(--border-color)');
        demNguoiBiLoai();
        banLuan(); 
    }
    

    function batDauChoi(){
        demDauTien();
        ngayDauTien();
        // ketThucChoi();
    }

    function ketThucChoi(){
        themHoatDong('Trò chơi kết thúc!', 'var(--highlight-color)', 'var( --border-color)');
    }

    if (duLieuCauHinh) {
        hienThiThongTinCauHinhVaLoaiTroChoi();
        phanPhatTheNhanVat(duLieuCauHinh);
        batDauChoi();
    }
});
>>>>>>> bbe954e (first upload)
