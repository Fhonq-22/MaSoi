document.addEventListener("DOMContentLoaded", async function () {
    const rolesDataUrl = "https://raw.githubusercontent.com/Fhonq-22/MaSoi/main/libs/data/NhanVat.json";
    const roleSelectionDiv = document.getElementById("role-selection");
    const randomizeButton = document.getElementById("randomizeButton");
    const resultContainer = document.querySelector(".result-container");
    const playerRolesDiv = document.getElementById("player-roles");
    const viewedListDiv = document.getElementById("viewed-list");
    const notViewedListDiv = document.getElementById("not-viewed-list");

    let roles = [];
    let viewedPlayers = new Set(); // Set để lưu các số đã xem
    let totalPlayers = 0;

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
        totalPlayers = roles.reduce((sum, role, index) => {
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
        viewedPlayers.clear(); // Xóa danh sách đã xem trước đó

        shuffledRoles.forEach((role, index) => {
            const playerCard = document.createElement("div");
            playerCard.className = "player-card";
            playerCard.innerHTML = `
                <h3>${index + 1}</h3>
                <button onclick="showRole(this, ${index + 1})">Xem</button>
                <div class="role-info" hidden>
                    <p>${role.name}</p>
                    <img src="${role.image}" alt="${role.name}">
                    <button onclick="closeRole(this)">Đóng</button>
                </div>
            `;
            playerRolesDiv.appendChild(playerCard);
        });

        updateViewedLists();
    });

    // Hiển thị vai trò khi người chơi nhấn nút
    window.showRole = (button, playerNumber) => {
        const roleInfo = button.parentElement.querySelector(".role-info");
        roleInfo.hidden = false; // Hiển thị ảnh và tên vai trò
        button.style.display = "none"; // Ẩn nút "Hiển thị vai trò"
        viewedPlayers.add(playerNumber); // Thêm số vào danh sách đã xem
        updateViewedLists(); // Cập nhật danh sách đã xem và chưa xem
    };

    // Đóng vai trò khi người chơi nhấn nút "Đóng"
    window.closeRole = (button) => {
        const roleInfo = button.parentElement;
        roleInfo.hidden = true; // Ẩn ảnh và tên vai trò
        roleInfo.previousElementSibling.style.display = "inline-block"; // Hiển thị lại nút "Hiển thị vai trò"
    };

    // Cập nhật danh sách đã xem và chưa xem
    function updateViewedLists() {
        viewedListDiv.innerHTML = "";
        notViewedListDiv.innerHTML = "";
    
        for (let i = 1; i <= totalPlayers; i++) {
            const listItem = document.createElement("p");
            listItem.textContent = `P${i}`;
            listItem.dataset.playerNumber = i; // Lưu số thứ tự người chơi vào dataset
    
            // Gắn sự kiện click cho từng item
            listItem.addEventListener("click", () => {
                const targetPlayerCard = playerRolesDiv.querySelector(`.player-card:nth-child(${i})`);
                if (targetPlayerCard) {
                    // Cuộn đến mục tiêu
                    targetPlayerCard.scrollIntoView({ behavior: "smooth", block: "center" });
    
                    // Thêm hiệu ứng highlight
                    targetPlayerCard.classList.add("highlight");
    
                    // Loại bỏ hiệu ứng highlight sau 2 giây
                    setTimeout(() => {
                        targetPlayerCard.classList.remove("highlight");
                    }, 2000);
                }
            });
    
            if (viewedPlayers.has(i)) {
                viewedListDiv.appendChild(listItem);
            } else {
                notViewedListDiv.appendChild(listItem);
            }
        }
    }      

    // Tải dữ liệu vai trò
    await fetchRoles();

    // Thêm logic ẩn/hiện vai trò
    const toggleButton = document.getElementById("toggleRoleSelection");
    const rolesContainer = document.querySelector(".roles-container");

    toggleButton.addEventListener("click", () => {
        rolesContainer.classList.toggle("collapsed");
        toggleButton.textContent = rolesContainer.classList.contains("collapsed")
            ? "Mở rộng"
            : "Rút gọn";
    });
});
