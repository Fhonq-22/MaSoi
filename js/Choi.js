document.addEventListener('DOMContentLoaded', () => {
    let chiSoNguoiChoi = 0; 
    let vaiTroNguoiChoi = null;
    let chiSoCanhSatTruong = null;
    let dsNguoiChoi = []; // Danh sách tất cả người chơi
    let ktSongCon = [];
    let dsLoaiMoiDem = [];
    let nguoiChoiBiCan = null;
    let nguoiDuocBaoVe = null;
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
        mucHoatDong.innerHTML = hoatDong;
        mucHoatDong.style.color = mauChu;
        mucHoatDong.style.backgroundColor = mauNen;
        danhSachHoatDong.appendChild(mucHoatDong);
    }

    function phanPhatTheNhanVat(duLieuCauHinh) {
        const cacVaiTro = Object.entries(duLieuCauHinh);
        const tatCaVaiTro = cacVaiTro.flatMap(([vaiTro, soLuong]) => Array(soLuong).fill(vaiTro));
    
        // Xáo trộn mảng vai trò
        for (let i = tatCaVaiTro.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [tatCaVaiTro[i], tatCaVaiTro[j]] = [tatCaVaiTro[j], tatCaVaiTro[i]];
        }
    
        const tongSoVaiTro = tatCaVaiTro.length;
        if (tongSoVaiTro >= 6) {
            chiSoCanhSatTruong = chonCanhSatTruong(tongSoVaiTro);
        }
    
        vaiTroNguoiChoi = tatCaVaiTro.pop(); // Lấy vai trò của Player1 sau khi xáo trộn
        dsNguoiChoi.push({
            soThuTu: 1,
            vaiTro: vaiTroNguoiChoi
        });
        
        let soThuTuNguoiChoi = 2;
        while (tatCaVaiTro.length > 0) {
            const vaiTro = tatCaVaiTro.pop(); // Lấy vai trò cho người chơi tiếp theo
            dsNguoiChoi.push({
                soThuTu: soThuTuNguoiChoi,
                vaiTro: vaiTro
            });
            soThuTuNguoiChoi++;
        }
        ktSongCon = Array(dsNguoiChoi.length).fill(1);
        themHoatDong(`Vai trò của bạn (Player1) là: ${vaiTroNguoiChoi}`, 'var(--button-bg)', 'var(--border-color)');
        console.log(dsNguoiChoi);
    }
    

    function layNguoiChoiConSong() {
        return dsNguoiChoi.filter((_, index) => ktSongCon[index] === 1);
    }

    function layNguoiChoiBiLoai() {
        return dsNguoiChoi.filter((_, index) => ktSongCon[index] === 0);
    }

    function chonCanhSatTruong(tongSoNguoiChoi) {
        chiSoCanhSatTruong = Math.floor(Math.random() * tongSoNguoiChoi) + 1;
        themHoatDong(`Player${chiSoCanhSatTruong} đã được chọn làm Cảnh sát trưởng.`, 'var(--button-bg)', 'var(--border-color)');
        return chiSoCanhSatTruong;
    }

    function tromThe(){
        ghepDoi();
    }

    function ghepDoi() {
        const dsNguoiChoiConSong = layNguoiChoiConSong();
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

                themHoatDong(`Cupid đã ghép đôi Player${selectedPlayers[0].soThuTu} và Player${selectedPlayers[1].soThuTu}`, 'var(--button-bg)', 'var(--border-color)');
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
        nhinTromSoi();
    }
    
    function nhinTromSoi(){
        soiTanCong();
    }

    function soiTanCong() {
        const dsNguoiChoiConSong = layNguoiChoiConSong();
        if (vaiTroNguoiChoi.includes('Sói')) {
            const cacSoiKhac = dsNguoiChoiConSong
                .filter(nguoiChoi => nguoiChoi.vaiTro.includes('Sói') && nguoiChoi.soThuTu !== chiSoNguoiChoi + 1)
                .map(nguoiChoi => nguoiChoi.soThuTu);

            themHoatDong('Các sói khác: ' + cacSoiKhac.join(', '), 'var(--button-bg)', 'var(--border-color)');
            themHoatDong('Bạn có thể cắn người chơi khác sau 10s', 'var(--button-bg)', 'var(--border-color)');
            setTimeout(() => {
                const chiSoMucTieu = prompt('Bạn là sói, chọn số người chơi để cắn (1 - ' + dsNguoiChoiConSong.length + '):') - 1;

                if (chiSoMucTieu >= 0 && chiSoMucTieu < dsNguoiChoiConSong.length) {
                    nguoiChoiBiCan = dsNguoiChoiConSong[chiSoMucTieu];
                    
                    themHoatDong('Sói đã cắn Player' + nguoiChoiBiCan.soThuTu, 'var(--button-bg)', 'var(--border-color)');
                    baoVe();
                } else {
                    themHoatDong('Lỗi: Số người chơi không hợp lệ.', 'var(--button-bg)', 'var(--border-color)');
                    baoVe();
                }
            }, 1000);
        } else {
            const chiSoNgauNhien = Math.floor(Math.random() * dsNguoiChoiConSong.length);
            nguoiChoiBiCan = dsNguoiChoiConSong[chiSoNgauNhien];
            themHoatDong('Sói đã tấn công Player' + nguoiChoiBiCan.soThuTu, 'var(--button-bg)', 'var(--border-color)');
            baoVe();
        }
    }


    function baoVe() {
        if (dsNguoiChoi.some(player => player.vaiTro === 'Bảo vệ')) {
            if (vaiTroNguoiChoi === 'Bảo vệ') {
                const index = prompt(`Chọn số người chơi để bảo vệ (1 - ${dsNguoiChoi.length}):`) - 1;
    
                if (index >= 0 && index < dsNguoiChoi.length && ktSongCon[index] === 1) {
                    nguoiDuocBaoVe = dsNguoiChoi[index];
                    
                    themHoatDong(`Bảo vệ đã bảo vệ Player${nguoiDuocBaoVe.soThuTu}`, 'var(--button-bg)', 'var(--border-color)');
                } else {
                    themHoatDong('Lỗi: Số người chơi không hợp lệ hoặc người chơi đã chết.', 'var(--button-bg)', 'var(--border-color)');
                }
            } else {
                const dsConSong = dsNguoiChoi.filter((_, index) => ktSongCon[index] === 1);
                const randomIndex = Math.floor(Math.random() * dsConSong.length);
                nguoiDuocBaoVe = dsConSong[randomIndex];
                
                themHoatDong(`Bảo vệ đã bảo vệ Player${nguoiDuocBaoVe.soThuTu}`, 'var(--button-bg)', 'var(--border-color)');
            }
        }
    
        suDungThuoc();
    }
    
    
    function suDungThuoc(){
        soiMaSoi();
    }

    function soiMaSoi() {
        console.log('Vai trò người chơi:', vaiTroNguoiChoi); // Kiểm tra giá trị của vaiTroNguoiChoi
        const dsConSong = layNguoiChoiConSong();
        let nguoiDuocKiemTra;
    
        if (vaiTroNguoiChoi === 'Tiên tri') {
            const soThuTu = prompt(`Tiên tri, bạn muốn kiểm tra người chơi nào? Nhập số thứ tự (1 - ${dsConSong.length}):`);
            nguoiDuocKiemTra = dsConSong.find(player => player.soThuTu == soThuTu);
    
            if (!nguoiDuocKiemTra) {
                themHoatDong('Lỗi: Số người chơi không hợp lệ hoặc người chơi đã chết.', 'var(--button-bg)', 'var(--border-color)');
                return;
            }
        } else {
            const randomIndex = Math.floor(Math.random() * dsConSong.length);
            nguoiDuocKiemTra = dsConSong[randomIndex];
        }
    
        if (nguoiDuocKiemTra.vaiTro.includes('Sói')) {
            themHoatDong(`Player${nguoiDuocKiemTra.soThuTu} là Sói!`, 'var(--button-bg)', 'var(--border-color)');
        } else {
            themHoatDong(`Player${nguoiDuocKiemTra.soThuTu} không phải là Sói.`, 'var(--button-bg)', 'var(--border-color)');
        }
    
        chonNguoiChetTheo();
    }      

    function chonNguoiChetTheo(){
        canSoiThuong();
    }
    
    function canSoiThuong(){
        lamMoi();
        ngayDauTien();
    }

    function lamMoi(){
        ktSongCon[dsNguoiChoi.indexOf(nguoiChoiBiCan)] = 0;
        dsLoaiMoiDem.push(nguoiChoiBiCan);
        nguoiDuocBaoVe.isProtected = true;
        dsLoaiMoiDem = dsLoaiMoiDem.filter(player => player.soThuTu !== nguoiDuocBaoVe.soThuTu);
        
    }

    function demDauTien() {
        themHoatDong('ĐÊM ĐẦU TIÊN', 'var(--text-color)', 'var(--border-color)');
        tromThe();
    }
    
    function demNguoiBiLoai(){
        if(dsLoaiMoiDem.length > 0){
            const danhSachNguoiChoiBiLoai = dsLoaiMoiDem.map(nguoiChoi => nguoiChoi.soThuTu).join(', ');
            themHoatDong(
                `Đêm qua là 1 đêm kinh hoàng! Có ${dsLoaiMoiDem.length} người chơi bị chết!<br>
                Những người chơi bị chết: ${danhSachNguoiChoiBiLoai}`,
                'var(--button-bg)',
                'var(--border-color)'
            );        
        }else{
            themHoatDong('Đêm qua là 1 đêm yên bình vì không ai bị chết!', 'var(--button-bg)', 'var(--border-color)');
        }
    }

    function banLuan() {
        themHoatDong('Bắt đầu thời gian bàn luận (30s)', 'var(--button-bg)', 'var(--border-color)');
        
        setTimeout(() => {
            themHoatDong('Thời gian bàn luận đã kết thúc!', 'var(--button-bg)', 'var(--border-color)');
            boPhieu();  
        }, 3000);
    }
    
    function boPhieu() {
        themHoatDong('Bắt đầu thời gian bỏ phiếu...', 'var(--button-bg)', 'var(--border-color)');
        
        const soPhieu = {};
        const ketQuaBoPhieu = [];
        const dsConSong = layNguoiChoiConSong();
    
        dsConSong.forEach(nguoiChoi => {
            soPhieu[nguoiChoi.soThuTu] = 0;
        });
    
        dsConSong.forEach(nguoiChoi => {
            if (nguoiChoi.soThuTu !== 1) {
                const boPhieuTrong = Math.random() < 0.5;
                let nguoiBau = null;
    
                if (!boPhieuTrong) {
                    do {
                        nguoiBau = dsConSong[Math.floor(Math.random() * dsConSong.length)];
                    } while (nguoiBau.soThuTu === nguoiChoi.soThuTu);
                }
    
                ketQuaBoPhieu.push(`- Player${nguoiChoi.soThuTu} ${boPhieuTrong ? 'bỏ phiếu trắng' : `bỏ phiếu cho Player${nguoiBau.soThuTu}`}`);
    
                if (!boPhieuTrong) {
                    soPhieu[nguoiBau.soThuTu]++;
                }
            }
        });
    
        setTimeout(() => {
            const ketQuaTongHop = ketQuaBoPhieu.join('<br>');
            themHoatDong(`Kết quả bỏ phiếu:<br>${ketQuaTongHop}`, 'var(--button-bg)', 'var(--border-color)');
            if(dsConSong.some(n => n.soThuTu === 1)){
                const boPhieuPlayer1 = setTimeout(() => {
                    const nguoiBauPlayer1 = prompt("Bạn muốn bỏ phiếu cho ai? Nhập số thứ tự của người chơi:");
                    if (nguoiBauPlayer1 && dsConSong.some(n => n.soThuTu == nguoiBauPlayer1)) {
                        ketQuaBoPhieu.push(`- Bạn đã bỏ phiếu cho Player${nguoiBauPlayer1}`);
                        soPhieu[nguoiBauPlayer1]++;
                    } else {
                        ketQuaBoPhieu.push(`- Bạn đã bỏ phiếu trắng`);
                    }
            
                    themHoatDong(`${ketQuaBoPhieu[ketQuaBoPhieu.length - 1]}`, 'var(--button-bg)', 'var(--border-color)');
                    treoCo(soPhieu, dsNguoiChoi);
                }, 1000);
            }
            else{
                treoCo(soPhieu, dsNguoiChoi);
            }
        }, 5000);        
    }    
    
    function treoCo(soPhieu, dsNguoiChoi) {
        let maxPhieu = 0;
        let nguoiBiTreoCo = null;
    
        for (const [soThuTu, phieu] of Object.entries(soPhieu)) {
            if (phieu > maxPhieu) {
                maxPhieu = phieu;
                nguoiBiTreoCo = dsNguoiChoi.find(nguoiChoi => nguoiChoi.soThuTu == soThuTu);
            } else if (phieu === maxPhieu) {
                nguoiBiTreoCo = null;
            }
        }
    
        if (nguoiBiTreoCo) {
            themHoatDong(`Player${nguoiBiTreoCo.soThuTu} (${nguoiBiTreoCo.vaiTro}) bị treo cổ vì nhận được nhiều phiếu nhất (${maxPhieu} phiếu)!`, 'var(--button-bg)', 'var(--border-color)');
        } else {
            themHoatDong('Không có ai bị treo cổ vì số phiếu bằng nhau hoặc không đủ số phiếu!', 'var(--button-bg)', 'var(--border-color)');
        }
    }
    
    
    function ngayDauTien() {
        themHoatDong('NGÀY ĐẦU TIÊN', 'var(--text-color)', 'var(--border-color)');
        demNguoiBiLoai();
        banLuan(); 
    }
    

    function batDauChoi(){
        demDauTien();
        // ngayDauTien();
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
