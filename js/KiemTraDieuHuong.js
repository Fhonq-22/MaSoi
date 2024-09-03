// js/KiemTraDieuHuong.js

function navigateTo(url) {
    fetch(url)
        .then(response => {
            if (response.ok) {
                window.location.href = url;
            } else {
                window.location.href = '404.html';
            }
        })
        .catch(() => {
            window.location.href = '404.html';
        });
}