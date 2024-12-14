document.addEventListener("DOMContentLoaded", async function () {
    const rolesDataUrl = "https://raw.githubusercontent.com/Fhonq-22/MaSoi/main/libs/data/NhanVat.json";
    const roleSelectionDiv = document.getElementById("role-selection");
    const randomizeButton = document.getElementById("randomizeButton");
    const resultContainer = document.querySelector(".result-container");
    const playerRolesDiv = document.getElementById("player-roles");

    let roles = [];

    // Hàm tải dữ liệu vai trò từ JSON
    async function fetchRoles() {
        try {
            const response = await fetch(rolesDataUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            // Kết hợp tất cả các vai trò từ các phe
            roles = [
                ...data.phe_dan_lang.map(role => ({ name: role.ten, image: role.hinh_anh })),
                ...data.phe_soi.map(role => ({ name: role.ten, image: role.hinh_anh })),
                ...data.phe_thu_ba.map(role => ({ name: role.ten, image: role.hinh_anh }))
            ];

            displayRoles();
        } catch (error) {
            console.error("Error fetching roles:", error);
            alert("Không thể tải dữ liệu vai trò. Vui lòng thử lại sau.");
        }
    }

    // Hàm hiển thị danh sách vai trò
    function displayRoles() {
        roles.forEach((role, index) => {
            const roleCard = document.createElement("div");
            roleCard.className = "role-card";
            roleCard.innerHTML = `
                <h3>${role.name}</h3>
                <input type="number" id="role-${index}" value="0" min="0" />
            `;
            roleSelectionDiv.appendChild(roleCard);
        });
    }

    // Xử lý khi nhấn nút "Chia ngẫu nhiên"
    randomizeButton.addEventListener("click", () => {
        const totalPlayers = roles.reduce((sum, role, index) => {
            const count = parseInt(document.getElementById(`role-${index}`).value, 10) || 0;
            return sum + count;
        }, 0);

        if (totalPlayers === 0) {
            alert("Vui lòng chọn ít nhất một vai trò.");
            return;
        }

        // Tạo danh sách vai trò theo số lượng
        const roleList = [];
        roles.forEach((role, index) => {
            const count = parseInt(document.getElementById(`role-${index}`).value, 10) || 0;
            for (let i = 0; i < count; i++) {
                roleList.push(role);
            }
        });

        // Xáo trộn vai trò
        const shuffledRoles = roleList.sort(() => Math.random() - 0.5);

        // Hiển thị kết quả
        resultContainer.style.display = "block";
        playerRolesDiv.innerHTML = "";
        shuffledRoles.forEach((role, index) => {
            const playerCard = document.createElement("div");
            playerCard.className = "player-card";
            playerCard.innerHTML = `
                <h3>${index + 1}</h3>
                <button onclick="showRole(this)">Hiển thị</button>
                <div class="role-info" hidden>
                    <p>${role.name}</p>
                    <img src="${role.image}" alt="${role.name}">
                    <button onclick="closeRole(this)">Đóng</button>
                </div>
            `;
            playerRolesDiv.appendChild(playerCard);
        });
    });

    // Tải dữ liệu vai trò
    await fetchRoles();
});

// Hiển thị vai trò khi người chơi nhấn nút
function showRole(button) {
    const roleInfo = button.parentElement.querySelector(".role-info");
    roleInfo.hidden = false;  // Hiển thị ảnh và tên vai trò
    button.style.display = "none";  // Ẩn nút "Hiển thị vai trò"
}

// Đóng vai trò khi người chơi nhấn nút "Đóng"
function closeRole(button) {
    const roleInfo = button.parentElement;
    roleInfo.hidden = true;  // Ẩn ảnh và tên vai trò
    roleInfo.previousElementSibling.style.display = "inline-block";  // Hiển thị lại nút "Hiển thị vai trò"
}
