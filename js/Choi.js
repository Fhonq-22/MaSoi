document.addEventListener('DOMContentLoaded', () => {
    let chiSoNguoiChoi = 0; 
    let vaiTroNguoiChoi = null;
    let chiSoCanhSatTruong = null;
    let dsNguoiChoi = [];
    let ktSongCon = [];
    let dsLoaiMoiDem = [];
    let nguoiBiSoiCan = null;
    let nguoiDuocBaoVe = null;
    let daSuDungThuocGiai = false;
    let daSuDungThuocDoc = false;
    let nguoiBiDauDoc = null;
    let nguoiDuocThuocCuu = null;
    let nguoiBiBanTen = null;
    let sttNgay = 0;
    let sttDem = 0;
    const timeoutChoTuDong = 5000;
    const timeoutCho = 500;
    const soundAnTrom = new Audio('./libs/sound/AnTrom.mp3');
    const soundGhepDoi = new Audio('./libs/sound/GhepDoi.wav');
    const soundSoiHu = new Audio('./libs/sound/SoiHu.wav');
    const soundBaoVe = new Audio('./libs/sound/BaoVe.wav');
    const soundCheThuoc= new Audio('./libs/sound/CheThuoc.wav');
    const soundTienTri = new Audio('./libs/sound/TienTri.wav');
    const soundBanSung= new Audio('./libs/sound/BanSung.wav');
    const soundBanNgay = new Audio('./libs/sound/BanNgay.wav');
    const soundBanDem= new Audio('./libs/sound/BanDem.wav');
    const soundChienThang = new Audio('./libs/sound/ChienThang.wav');
    const soundThatBai = new Audio('./libs/sound/ThatBai.wav');
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

        for (let i = tatCaVaiTro.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [tatCaVaiTro[i], tatCaVaiTro[j]] = [tatCaVaiTro[j], tatCaVaiTro[i]];
        }

        const tongSoVaiTro = tatCaVaiTro.length;
        if (tongSoVaiTro >= 6) {
            chiSoCanhSatTruong = chonCanhSatTruong(tongSoVaiTro);
        }
        vaiTroNguoiChoi = tatCaVaiTro.pop();
        dsNguoiChoi.push({
            soThuTu: 1,
            vaiTro: vaiTroNguoiChoi
        });

        let soThuTuNguoiChoi = 2;
        while (tatCaVaiTro.length > 0) {
            const vaiTro = tatCaVaiTro.pop();
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

    function hienThiDieuKhien(tieuDe, dsLuaChon, callback) {
        const khuVucDieuKhien = document.getElementById('player-controls');
        const uniqueId = 'control-area-' + Math.random().toString(36).slice(2, 11);
        const controlAreaDiv = document.createElement('div');
        controlAreaDiv.id = uniqueId;
        const tieuDeDiv = document.createElement('h3');
        tieuDeDiv.textContent = tieuDe;
        controlAreaDiv.appendChild(tieuDeDiv);
        dsLuaChon.forEach((luaChon, index) => {
            const nutLuaChon = document.createElement('button');
            nutLuaChon.textContent = luaChon.ten;
            nutLuaChon.classList.add('control-button');
            nutLuaChon.addEventListener('click', () => {
                callback(index);
                const areaToRemove = document.getElementById(uniqueId);
                if (areaToRemove) {
                    areaToRemove.remove();
                }
            });
            controlAreaDiv.appendChild(nutLuaChon);
        });
        khuVucDieuKhien.appendChild(controlAreaDiv);
    }

    function tromThe(){
        soundAnTrom.play();
        setTimeout(ghepDoi,timeoutChoTuDong);
    }

    function ghepDoi() {
        soundAnTrom.pause();
        const dsNguoiChoiConSong = layNguoiChoiConSong();    
        if (dsNguoiChoiConSong.some(player => player.vaiTro === 'Cupid')) {
            soundGhepDoi.play();
            if (vaiTroNguoiChoi === 'Cupid') {
                let selectedPlayers = [];

                const dsLuaChon = dsNguoiChoiConSong.map(player => ({
                    ten: `Player${player.soThuTu}`,
                    giaTri: player
                }));

                hienThiDieuKhien('Cupid, chọn hai người chơi để ghép đôi', dsLuaChon, (index) => {
                    const nguoiChoiDuocChon = dsLuaChon[index].giaTri;
                    if (!selectedPlayers.includes(nguoiChoiDuocChon)) {
                        selectedPlayers.push(nguoiChoiDuocChon);
                        themHoatDong(`Cupid đã chọn Player${nguoiChoiDuocChon.soThuTu}`, 'var(--button-bg)', 'var(--border-color)');
                        if (selectedPlayers.length === 2) {
                            selectedPlayers.forEach(player => {
                                player.isCoupled = true;
                            });
                            themHoatDong(`Cupid đã ghép đôi Player${selectedPlayers[0].soThuTu} và Player${selectedPlayers[1].soThuTu}`, 'var(--button-bg)', 'var(--border-color)');
                            setTimeout(nhinTromSoi,timeoutCho);
                        }
                    }
                });
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
                themHoatDong(`Cupid đã ghép đôi ngẫu nhiên Player${player1.soThuTu} và Player${player2.soThuTu}`, 'var(--button-bg)', 'var(--border-color)');
                setTimeout(nhinTromSoi,timeoutChoTuDong);
            }
        }
        else{
            nhinTromSoi();
        }
    }    
    
    function nhinTromSoi(){
        soundGhepDoi.pause();
        soiTanCong();
    }

    function soiTanCong() {
        soundSoiHu.play();
        const dsNguoiChoiConSong = layNguoiChoiConSong();
        if (vaiTroNguoiChoi.includes('Sói')) {
            const cacSoiKhac = dsNguoiChoiConSong
                .filter(nguoiChoi => nguoiChoi.vaiTro.includes('Sói') && nguoiChoi.soThuTu !== chiSoNguoiChoi + 1)
                .map(nguoiChoi => nguoiChoi.soThuTu);
            themHoatDong('Các sói khác: ' + cacSoiKhac.join(', '), 'var(--button-bg)', 'var(--border-color)');
            themHoatDong('Bạn có thể cắn người chơi khác sau 5s', 'var(--button-bg)', 'var(--border-color)');

            setTimeout(() => {
                const dsLuaChon = dsNguoiChoiConSong
                    .map(player => ({
                        ten: `Player${player.soThuTu}`,
                        giaTri: player
                    }));
                hienThiDieuKhien('Bạn là sói, chọn người chơi để cắn:', dsLuaChon, (index) => {
                    nguoiBiSoiCan = dsLuaChon[index].giaTri;
                    themHoatDong('Sói đã cắn Player' + nguoiBiSoiCan.soThuTu, 'var(--button-bg)', 'var(--border-color)');
                    setTimeout(baoVe,timeoutCho);
                });
            }, timeoutChoTuDong);
        } else {
            const chiSoNgauNhien = Math.floor(Math.random() * dsNguoiChoiConSong.length);
            nguoiBiSoiCan = dsNguoiChoiConSong[chiSoNgauNhien];
            themHoatDong('Sói đã tấn công Player' + nguoiBiSoiCan.soThuTu, 'var(--button-bg)', 'var(--border-color)');
            setTimeout(baoVe,timeoutChoTuDong);
        }
    }    

    function baoVe() {
        soundSoiHu.pause();
        const dsNguoiChoiConSong = layNguoiChoiConSong();   
        if (dsNguoiChoiConSong.some(player => player.vaiTro === 'Bảo vệ')) {
            soundBaoVe.play();
            if (vaiTroNguoiChoi === 'Bảo vệ') {
                const dsLuaChon = dsNguoiChoi
                    .filter((_, index) => ktSongCon[index] === 1)
                    .map(player => ({
                        ten: `Player${player.soThuTu}`,
                        giaTri: player
                    }));

                hienThiDieuKhien('Bảo vệ, chọn người chơi để bảo vệ:', dsLuaChon, (index) => {
                    nguoiDuocBaoVe = dsLuaChon[index].giaTri;
                    themHoatDong(`Bảo vệ đã bảo vệ Player${nguoiDuocBaoVe.soThuTu}`, 'var(--button-bg)', 'var(--border-color)');
                    setTimeout(suDungThuoc,timeoutCho);
                });
            } else {
                const dsConSong = dsNguoiChoi.filter((_, index) => ktSongCon[index] === 1);
                const randomIndex = Math.floor(Math.random() * dsConSong.length);
                nguoiDuocBaoVe = dsConSong[randomIndex];
                themHoatDong(`Bảo vệ đã bảo vệ Player${nguoiDuocBaoVe.soThuTu}`, 'var(--button-bg)', 'var(--border-color)');
                setTimeout(suDungThuoc,timeoutChoTuDong);
            }
        } else {
            suDungThuoc();
        }
    }    
    
    function suDungThuoc() {
        soundBaoVe.pause();
        let daClickThuocGiai = false;
        let daClickThuocDoc = false;
        const dsNguoiChoiConSong = layNguoiChoiConSong();
        const phuThuy = dsNguoiChoiConSong.find(player => player.vaiTro === 'Phù thuỷ');
        if (phuThuy) { 
            soundCheThuoc.play();
            if (vaiTroNguoiChoi === 'Phù thuỷ') {
                if (!daSuDungThuocGiai) {
                    console.log("Hiển thị điều khiển thuốc giải");
                    hienThiDieuKhien('Phù thủy, bạn có muốn sử dụng thuốc giải để cứu người bị sói cắn không?', [
                        { ten: 'Không', giaTri: false },
                        { ten: 'Có', giaTri: true }
                    ], (choice) => {
                        console.log(`Chọn thuốc giải: ${choice}`);
                        if (choice) {
                            if (nguoiBiSoiCan) {
                                nguoiBiSoiCan.daBaoVe = true;
                                nguoiDuocThuocCuu = nguoiBiSoiCan;
                                themHoatDong(`Phù thủy đã sử dụng thuốc giải để cứu Player${nguoiBiSoiCan.soThuTu}`, 'var(--button-bg)', 'var(--border-color)');
                                daSuDungThuocGiai = true;
                            }
                        }
                        daClickThuocGiai = true;
                        if(daClickThuocDoc){
                            setTimeout(soiMaSoi,timeoutCho);
                        }
                    });
                }else{
                    daClickThuocGiai = true;
                }
                if (!daSuDungThuocDoc){
                    console.log("Hiển thị điều khiển thuốc độc");
                    hienThiDieuKhien('Phù thủy, bạn có muốn sử dụng thuốc độc để giết một người chơi không?', [
                        { ten: 'Không', giaTri: false },
                        { ten: 'Có', giaTri: true }
                    ], (choice) => {
                        console.log(`Chọn thuốc độc: ${choice}`);
                        if (choice) {
                            const dsLuaChon = dsNguoiChoi
                                .filter((player, index) => index !== phuThuy.soThuTu - 1)
                                .map(player => ({
                                    ten: `Player${player.soThuTu}`,
                                    giaTri: player
                                }));
                            console.log(dsLuaChon);
                            if (dsLuaChon.length > 0) {
                                hienThiDieuKhien('Phù thủy, chọn số người chơi để sử dụng thuốc độc:', dsLuaChon, (index) => {
                                    nguoiBiDauDoc = dsLuaChon[index].giaTri;
                                    themHoatDong(`Phù thủy đã sử dụng thuốc độc để giết Player${nguoiBiDauDoc.soThuTu}`, 'var(--button-bg)', 'var(--border-color)');
                                    daSuDungThuocDoc = true;
                                    daClickThuocDoc = true;
                                    if(daClickThuocGiai){
                                        setTimeout(soiMaSoi,timeoutCho);
                                    }
                                });
                            } else {
                                console.log("Không có người chơi nào để chọn cho thuốc độc");
                                setTimeout(soiMaSoi,timeoutCho);
                            }
                        }
                        else{
                            daClickThuocDoc = true;
                            if(daClickThuocGiai){
                                setTimeout(soiMaSoi,timeoutCho);
                            }
                        }
                    });
                }else{
                    daClickThuocDoc = true;
                }
                if(daSuDungThuocGiai && daSuDungThuocDoc){
                    setTimeout(soiMaSoi,timeoutCho);
                }
            } else {
                if (!daSuDungThuocGiai && nguoiBiSoiCan && Math.random() < 0.5) {
                    nguoiBiSoiCan.daBaoVe = true;
                    nguoiDuocThuocCuu = nguoiBiSoiCan;
                    themHoatDong(`Phù thủy (ngẫu nhiên) đã sử dụng thuốc giải để cứu Player${nguoiBiSoiCan.soThuTu}`, 'var(--button-bg)', 'var(--border-color)');
                    daSuDungThuocGiai = true;
                }
                if (!daSuDungThuocDoc && Math.random() < 0.5) {
                    const dsConSong = dsNguoiChoi.filter((_, index) => ktSongCon[index] === 1);
                    const randomIndex = Math.floor(Math.random() * dsConSong.length);
                    nguoiBiDauDoc = dsConSong[randomIndex];
                    themHoatDong(`Phù thủy (ngẫu nhiên) đã sử dụng thuốc độc để giết Player${nguoiBiDauDoc.soThuTu}`, 'var(--button-bg)', 'var(--border-color)');
                    daSuDungThuocDoc = true;
                }
                setTimeout(soiMaSoi,timeoutChoTuDong);
            }
        } else {
            soiMaSoi();
        }
    }
    
    function soiMaSoi() {
        soundCheThuoc.pause();
        let nguoiDuocKiemTra;
        const dsNguoiChoiConSong = layNguoiChoiConSong();
        if (dsNguoiChoiConSong.some(player => player.vaiTro === 'Tiên tri')) {
            soundTienTri.play();
            if (vaiTroNguoiChoi === 'Tiên tri') {
                const dsLuaChon = dsNguoiChoiConSong.map(player => ({
                    ten: `Player${player.soThuTu}`,
                    giaTri: player
                }));
        
                hienThiDieuKhien('Tiên tri, bạn muốn kiểm tra người chơi nào?', dsLuaChon, (index) => {
                    nguoiDuocKiemTra = dsLuaChon[index].giaTri;
                    if (!nguoiDuocKiemTra) {
                        themHoatDong('Lỗi: Số người chơi không hợp lệ hoặc người chơi đã chết.', 'var(--button-bg)', 'var(--border-color)');
                        return;
                    }
                    setTimeout(kiemTraVaiTro(nguoiDuocKiemTra),timeoutCho);
                });
            } else {
                const randomIndex = Math.floor(Math.random() * dsNguoiChoiConSong.length);
                nguoiDuocKiemTra = dsNguoiChoiConSong[randomIndex];
                setTimeout(kiemTraVaiTro(nguoiDuocKiemTra),timeoutChoTuDong);
            }
        }else{
            chonNguoiChetTheo();
        }
    }
    
    function kiemTraVaiTro(nguoiDuocKiemTra) {
        if (nguoiDuocKiemTra.vaiTro.includes('Sói')) {
            themHoatDong(`Player${nguoiDuocKiemTra.soThuTu} là Sói!`, 'var(--button-bg)', 'var(--border-color)');
        } else {
            themHoatDong(`Player${nguoiDuocKiemTra.soThuTu} không phải là Sói.`, 'var(--button-bg)', 'var(--border-color)');
        }
        chonNguoiChetTheo();
    }          

    function chonNguoiChetTheo() {
        soundTienTri.pause();
        const dsNguoiChoiConSong = layNguoiChoiConSong();
        if (dsNguoiChoiConSong.some(player => player.vaiTro === 'Thợ săn')) {
            soundBanSung.play();
            if (vaiTroNguoiChoi === 'Thợ săn') {
                const dsLuaChon = dsNguoiChoiConSong.map(player => ({
                    ten: `Player${player.soThuTu}`,
                    giaTri: player
                }));
                hienThiDieuKhien('Thợ săn, bạn muốn chọn người nào để chết theo?', dsLuaChon, (index) => {
                    nguoiBiBanTen = dsLuaChon[index].giaTri; 
                    themHoatDong(`Thợ săn đã chọn Player${nguoiBiBanTen.soThuTu} để chết theo.`, 'var(--button-bg)', 'var(--border-color)');
                    setTimeout(canSoiThuong,timeoutCho);
                });
            } else {
                const randomIndex = Math.floor(Math.random() * dsNguoiChoiConSong.length);
                nguoiBiBanTen = dsNguoiChoiConSong[randomIndex];
                themHoatDong(`Thợ săn (ngẫu nhiên) chọn Player${nguoiBiBanTen.soThuTu} để chết.`, 'var(--button-bg)', 'var(--border-color)');
                setTimeout(canSoiThuong,timeoutChoTuDong);
            }
        }else{
            canSoiThuong();
        }
    }    
    
    function canSoiThuong(){
        soundBanSung.pause();
        lamMoi();
        banNgay();
    }

    function lamMoi(){
        if(nguoiBiSoiCan){
            dsLoaiMoiDem = [];
            ktSongCon[dsNguoiChoi.indexOf(nguoiBiSoiCan)] = 0;
            dsLoaiMoiDem.push(nguoiBiSoiCan);
            nguoiBiSoiCan = null;
        }
        if(nguoiDuocBaoVe){
            nguoiDuocBaoVe.daBaoVe = true;
            ktSongCon[dsNguoiChoi.indexOf(nguoiDuocBaoVe)] = 1;
            dsLoaiMoiDem = dsLoaiMoiDem.filter(player => player.soThuTu !== nguoiDuocBaoVe.soThuTu);
            nguoiDuocBaoVe = null;
        }
        if(nguoiDuocThuocCuu){
            ktSongCon[nguoiDuocThuocCuu.soThuTu - 1] = 1;
            dsLoaiMoiDem = dsLoaiMoiDem.filter(player => player.soThuTu !== nguoiDuocThuocCuu.soThuTu);
            nguoiDuocThuocCuu = null;
        }
        if(nguoiBiDauDoc){
            ktSongCon[nguoiBiDauDoc.soThuTu - 1] = 0;
            dsLoaiMoiDem.push(nguoiBiDauDoc);
            nguoiBiDauDoc = null;
        }
        if(dsNguoiChoi.filter(player => player.vaiTro === 'Thợ săn' && ktSongCon[player.soThuTu - 1] === 1).length === 0 && nguoiBiBanTen){
            ktSongCon[nguoiBiBanTen.soThuTu - 1] = 0;
            dsLoaiMoiDem.push(nguoiBiBanTen);
            nguoiBiBanTen = null;
        }
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
                setTimeout(() => {
                    const dsLuaChon = dsConSong.map(n => ({ ten: `Player${n.soThuTu}` }));
                    hienThiDieuKhien("Bạn muốn bỏ phiếu cho ai?", dsLuaChon, (nguoiBauPlayer1) => {
                        if (nguoiBauPlayer1 >= 0 && nguoiBauPlayer1 < dsLuaChon.length) {
                            const nguoiChon = dsConSong[nguoiBauPlayer1];
                            ketQuaBoPhieu.push(`- Bạn đã bỏ phiếu cho Player${nguoiChon.soThuTu}`);
                            soPhieu[nguoiChon.soThuTu]++;
                        } else {
                            ketQuaBoPhieu.push(`- Bạn đã bỏ phiếu trắng`);
                        }
                        themHoatDong(`${ketQuaBoPhieu[ketQuaBoPhieu.length - 1]}`, 'var(--button-bg)', 'var(--border-color)');
                        treoCo(soPhieu, dsNguoiChoi);
                    });
                }, 1000);
            }
            else{
                treoCo(soPhieu, dsNguoiChoi);
            }
        }, timeoutChoTuDong);        
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
            ktSongCon[nguoiBiTreoCo.soThuTu - 1] = 0;
            nguoiBiTreoCo = null;
            kiemTraKetThuc();
        } else {
            themHoatDong('Không có ai bị treo cổ vì số phiếu bằng nhau hoặc không đủ số phiếu!', 'var(--button-bg)', 'var(--border-color)');
            kiemTraKetThuc();
        }
    }

    function banNgay() {
        soundBanDem.pause();
        soundBanNgay.play();
        sttNgay++;
        themHoatDong('NGÀY THỨ ' + sttNgay, 'var(--text-color)', 'var(--border-color)');
        demNguoiBiLoai();
        setTimeout(banLuan,timeoutCho); 
    }
    
    function banDem() {
        soundBanNgay.pause();
        soundBanDem.play();
        sttDem++;
        themHoatDong('ĐÊM THỨ ' + sttDem, 'var(--text-color)', 'var(--border-color)');
        setTimeout(tromThe, 2000);
    }

    function batDauChoi(){
        hienThiDieuKhien('Bắt đầu chơi!', [
            { ten: 'Không', giaTri: false },
            { ten: 'Có', giaTri: true }
        ], (choice) => {
            if(choice){
                banDem();
            }else{
                setTimeout(batDauChoi, 3000);
            }
        });
    }

    function ketThucChoi(kq){
        const kqDiv = document.getElementById('game-result');
        const modal = document.getElementById('result-modal');
        if(kq.includes("thắng")){
            soundChienThang.play();
        }
        else{
            soundThatBai.play();
        }
        themHoatDong('TRÒ CHƠI KẾT THÚC!', 'var(--highlight-color)', 'var( --border-color)');
        kqDiv.innerHTML = kq;
        modal.style.display = "block";
        document.getElementById('review-button').onclick = () => {
            modal.style.display = "none";
        };
        document.getElementById('restart-button').onclick = () => {
            location.reload();
        };
        document.getElementById('config-button').onclick = () => {
            window.location.href = "MaSoiCoBan.html";
        };
        document.getElementById('home-button').onclick = () => {
            window.location.href = "TrangChu.html";
        };
        document.getElementById('share-button').onclick = () => {
            alert("Tính năng đang được phát triển!");
        };
        document.getElementById('close-button').onclick = () => {
            modal.style.display = "none";
        };
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        };
    }

    function kiemTraKetThuc() {
        const soLuongSoi = dsNguoiChoi.filter(player => player.vaiTro.includes('Sói') && ktSongCon[player.soThuTu - 1] === 1).length;
        const soLuongDanLang = dsNguoiChoi.filter(player => !player.vaiTro.includes('Sói') && ktSongCon[player.soThuTu - 1] === 1).length;
        
        if (soLuongSoi === 0) {
            if (!vaiTroNguoiChoi.includes('Sói')) {
                ketThucChoi('Bạn là phe Dân làng. Dân làng đã thắng!');
            } else {
                ketThucChoi('Bạn là phe Sói. Sói đã thua!');
            }
        } else if (soLuongSoi >= soLuongDanLang) {
            if (vaiTroNguoiChoi.includes('Sói')) {
                ketThucChoi('Bạn là phe Sói. Sói đã thắng!');
            } else {
               ketThucChoi('Bạn là phe Dân làng. Dân làng đã thua!');
            }
        } else {
            console.log('Trò chơi vẫn tiếp tục.');
            banDem();
            return;
        }  
    }
    
    if (duLieuCauHinh) {
        hienThiThongTinCauHinhVaLoaiTroChoi();
        phanPhatTheNhanVat(duLieuCauHinh);
        setTimeout(batDauChoi, 3000);
    }
});