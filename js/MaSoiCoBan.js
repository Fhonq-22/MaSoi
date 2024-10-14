// MaSoiCoBan.js

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('confirmButton').addEventListener('click', () => {
        const playerCount = parseInt(document.getElementById('playerCount').value);

        if (isNaN(playerCount) || playerCount < 4 || playerCount > 18) {
            alert('Vui lòng nhập số người chơi hợp lệ (từ 4 đến 18).');
            return;
        }

        taoDanhSachVaiTro(playerCount);
    });
});

function taoDanhSachVaiTro(playerCount) {
    const rolesDisplay = document.getElementById('rolesDisplay');
    rolesDisplay.innerHTML = '';

    fetch('https://raw.githubusercontent.com/Fhonq-22/MaSoi/main/libs/data/ChiaVanChoi.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Lỗi khi tải cấu hình vai trò: ' + response.statusText);
            }
            return response.json();
        })
        .then(configData => {
            const configs = configData[playerCount];
            if (configs) {
                const randomConfig = configs[Math.floor(Math.random() * configs.length)];

                let configHtml = '<div class="config-section"><h2>Cấu Hình Vai Trò</h2><ul>';
                for (const [role, count] of Object.entries(randomConfig)) {
                    configHtml += `<li><span>${role}</span> <span class="role-count">${count}</span></li>`;
                }
                configHtml += '</ul><button class="play-button">Chơi</button></div>';
                rolesDisplay.innerHTML = configHtml;

                document.querySelector('.play-button').addEventListener('click', () => {
                    const configData = encodeURIComponent(JSON.stringify(randomConfig));
                    const url = `Choi.html?config=${configData}`;
                    dieuHuongDen(url); // Sử dụng hàm dieuHuongDen
                });

                return fetch('https://raw.githubusercontent.com/Fhonq-22/MaSoi/main/libs/data/NhanVat.json');
            } else {
                rolesDisplay.innerHTML = '<p>Không có cấu hình cho số người chơi này.</p>';
                console.warn('Cấu hình không được tìm thấy cho số lượng người chơi:', playerCount);
                return Promise.reject('Cấu hình không tồn tại.');
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Lỗi khi tải dữ liệu nhân vật: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            const characters = {
                "Dân làng": data.phe_dan_lang,
                "Sói thường": data.phe_soi,
                "Sói con": data.phe_soi,
                "Nửa người nửa sói": data.phe_thu_ba,
                "Sói trắng": data.phe_thu_ba,
                "Ăn trộm": data.phe_thu_ba,
                "Bảo vệ": data.phe_dan_lang,
                "Tiên tri": data.phe_dan_lang,
                "Thợ săn": data.phe_dan_lang,
                "Phù Thủy": data.phe_dan_lang,
                "Cupid": data.phe_dan_lang,
                "Cô Bé": data.phe_dan_lang,
            };

            displayCharacterDetails(characters);
        })
        .catch(error => {
            console.error('Lỗi khi xử lý dữ liệu:', error);
            rolesDisplay.innerHTML = '<p>Không thể tải thông tin nhân vật.</p>';
        });
}

function displayCharacterDetails(characters) {
    const rolesDisplay = document.getElementById('rolesDisplay');
    const roleItems = rolesDisplay.querySelectorAll('li');

    roleItems.forEach(item => {
        const roleName = item.querySelector('span').textContent.trim();
        const count = parseInt(item.querySelector('.role-count').textContent.trim());

        const characterList = characters[roleName] || [];
        for (let i = 0; i < count; i++) {
            characterList.forEach(character => {
                if (character.ten === roleName) {
                    const characterHtml = `
                        <div class="role-card">
                            <img src="${character.hinh_anh}" alt="${character.ten}">
                            <div class="role-content">
                                <h2>${character.ten}</h2>
                                <p>${character.mo_ta}</p>
                                <p class="points">Điểm: ${character.diem}</p>
                            </div>
                        </div>
                    `;
                    rolesDisplay.insertAdjacentHTML('beforeend', characterHtml);
                }
            });
        }
    });
}
