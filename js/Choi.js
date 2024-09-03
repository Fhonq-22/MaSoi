document.addEventListener('DOMContentLoaded', () => {
    // Hàm để lấy tham số từ URL
    function getQueryParams() {
        const params = new URLSearchParams(window.location.search);
        return {
            config: params.get('config'),
            type: params.get('type')
        };
    }

    // Hàm để giải mã dữ liệu cấu hình
    function decodeConfig(encodedConfig) {
        try {
            const decodedConfig = decodeURIComponent(encodedConfig);
            return JSON.parse(decodedConfig);
        } catch (e) {
            console.error('Error decoding config:', e);
            return null;
        }
    }

    // Hiển thị thông tin cấu hình và loại trò chơi
    function displayConfigAndType() {
        const params = getQueryParams();
        const configData = decodeConfig(params.config);
        const type = params.type;

        const configDisplay = document.getElementById('game-config');
        if (configData && type) {
            let configHtml = '<h2>Thông Tin Cấu Hình</h2><div class="config-row">';
            for (const [role, count] of Object.entries(configData)) {
                configHtml += `
                    <div class="config-item">
                        <span class="role-name">${role}:</span>
                        <span class="role-count">${count}</span>
                    </div>
                `;
            }
            configHtml += '</div>';
            configHtml += `<h2>Loại Trò Chơi</h2><p>${type}</p>`;
            configDisplay.innerHTML = configHtml;
        } else {
            configDisplay.innerHTML = '<p>Không có dữ liệu cấu hình hoặc loại trò chơi.</p>';
        }
    }

    // Hàm để hiển thị hoạt động
    function displayActivity(activityList) {
        const activityDisplay = document.getElementById('activity-list');
        activityDisplay.innerHTML = '';
        activityList.forEach(activity => {
            const li = document.createElement('li');
            li.textContent = activity;
            activityDisplay.appendChild(li);
        });
    }

    // Hàm để hiển thị thẻ nhân vật của người chơi
    function displayPlayerCard(role) {
        const playerInfo = document.getElementById('player-info');
        playerInfo.innerHTML = `
            <div class="player-card">
                <h2>Thẻ Nhân Vật của Bạn</h2>
                <div class="role-card">${role}</div>
            </div>
        `;
    }

    // Hàm để phân phối thẻ nhân vật cho người chơi và máy
    function distributeRoles(configData) {
        const roles = Object.entries(configData);
        const allRoles = roles.flatMap(([role, count]) => Array(count).fill(role));
        const totalRoles = allRoles.length;

        // Chọn ngẫu nhiên vai trò của người chơi
        const playerRoleIndex = Math.floor(Math.random() * totalRoles);
        const playerRole = allRoles[playerRoleIndex];

        // Xóa vai trò của người chơi khỏi danh sách thẻ
        allRoles.splice(playerRoleIndex, 1);

        // Trộn ngẫu nhiên các thẻ còn lại cho các máy
        for (let i = allRoles.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allRoles[i], allRoles[j]] = [allRoles[j], allRoles[i]];
        }

        // Hiển thị thẻ nhân vật của người chơi
        displayPlayerCard(playerRole);

        // Hiển thị thẻ nhân vật của máy trên console
        console.log('Thẻ nhân vật của máy:', allRoles);

        // Thực hiện các hoạt động khác (ví dụ: hiển thị hoạt động)
        displayActivity(['Người chơi được phân vai: ' + playerRole]);
    }

    // Gọi các hàm để hiển thị thông tin và phân phối vai trò
    const params = getQueryParams();
    const configData = decodeConfig(params.config);
    if (configData) {
        displayConfigAndType();
        distributeRoles(configData);
    }
});
