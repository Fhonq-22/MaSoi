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

    // Hàm để thêm hoạt động vào danh sách
    function addActivity(activity) {
        const activityList = document.getElementById('activity-list');
        const listItem = document.createElement('li');
        listItem.textContent = activity;
        activityList.appendChild(listItem);
    }

    // Hàm để hiển thị thông tin phân vai
    function showRoleDistribution(distribution) {
        addActivity('Thông tin phân vai:');
        distribution.forEach(item => {
            addActivity(`Người chơi số ${item.index}: ${item.role}`);
        });
    }

    // Hàm để phân phối thẻ nhân vật cho người chơi và máy
    function distributeRoles(configData) {
        const roles = Object.entries(configData);
        const allRoles = roles.flatMap(([role, count]) => Array(count).fill(role));
        const totalRoles = allRoles.length;

        // Chọn vai trò cho người chơi số 1
        const playerRoleIndex = 0; // Người chơi mặc định số 1
        const playerRole = allRoles[Math.floor(Math.random() * totalRoles)];

        // Xóa vai trò của người chơi khỏi danh sách thẻ
        allRoles.splice(allRoles.indexOf(playerRole), 1);

        // Trộn ngẫu nhiên các thẻ còn lại cho các máy
        for (let i = allRoles.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allRoles[i], allRoles[j]] = [allRoles[j], allRoles[i]];
        }

        // Hiển thị phân vai cho người chơi số 1
        showRoleDistribution([{ index: playerRoleIndex + 1, role: playerRole }]);

        // Phân phối vai trò cho người chơi khác
        let playerCount = 2; // Bắt đầu từ số 2 cho các người chơi khác
        const remainingRoles = [];
        for (let i = 0; i < allRoles.length; i++) {
            remainingRoles.push({ index: playerCount, role: allRoles[i] });
            playerCount++;
        }

        // Hiển thị phân vai cho tất cả người chơi
        showRoleDistribution([{ index: playerRoleIndex + 1, role: playerRole }, ...remainingRoles]);

        // Xử lý đêm đầu tiên
        handleNightOne(playerRoleIndex, playerRole, remainingRoles);
    }

    // Xử lý đêm đầu tiên
    function handleNightOne(playerRoleIndex, playerRole, remainingRoles) {
        if (playerRole === 'Sói thường' || playerRole === 'Sói con' || playerRole === 'Sói trắng') {
            // Nếu là sói, hiển thị các sói còn lại và yêu cầu chọn mục tiêu
            const otherWolves = remainingRoles
                .filter(roleDescription => roleDescription.role.includes('Sói') || roleDescription.role.includes('Sói con'))
                .map(description => description.index);

            addActivity('Các sói khác: ' + otherWolves.join(', '));

            const targetIndex = prompt('Bạn là sói, chọn số thứ tự người chơi để cắn (1 - ' + remainingRoles.length + '):') - 1;
            if (targetIndex >= 0 && targetIndex < remainingRoles.length) {
                const targetRole = remainingRoles[targetIndex].role;
                addActivity('Sói đã cắn người chơi số ' + remainingRoles[targetIndex].index + ' với vai trò: ' + targetRole);
            } else {
                addActivity('Lỗi: Người chơi không hợp lệ.');
            }
        } else {
            // Sói sẽ tấn công ngẫu nhiên nếu không phải là sói
            const randomIndex = Math.floor(Math.random() * remainingRoles.length);
            const targetRole = remainingRoles[randomIndex].role;
            addActivity('Sói đã tấn công người chơi số ' + remainingRoles[randomIndex].index + ' với vai trò: ' + targetRole);
        }
    }


    // Gọi các hàm để hiển thị thông tin và phân phối vai trò
    const params = getQueryParams();
    const configData = decodeConfig(params.config);
    if (configData) {
        displayConfigAndType();
        distributeRoles(configData);
    }
});
