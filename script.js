// Конфигурация администратора
const ADMIN_CREDENTIALS = {
    login: "admin",
    password: "rzd2023"
};


// Элементы
const adminOverlay = document.getElementById('adminOverlay');
const adminLoginBtn = document.querySelector('.fa-user-tie').closest('.card');
const adminSubmitBtn = document.getElementById('adminSubmit');
const closeBtn = document.getElementById('closeAdminPanel');
const errorMessage = document.getElementById('adminErrorMessage');

// Открытие панели
adminLoginBtn.addEventListener('click', function(e) {
    e.preventDefault();
    adminOverlay.style.display = 'flex';
    document.getElementById('adminLogin').focus();
});

// Закрытие панели
closeBtn.addEventListener('click', closeAdminPanel);
adminOverlay.addEventListener('click', function(e) {
    if (e.target === adminOverlay) {
        closeAdminPanel();
    }
});

// Проверка входа
adminSubmitBtn.addEventListener('click', function() {
    const login = document.getElementById('adminLogin').value;
    const password = document.getElementById('adminPassword').value;
    
    if (login === ADMIN_CREDENTIALS.login && password === ADMIN_CREDENTIALS.password) {
        window.location.href = "Admins.html";
    } else {
        errorMessage.style.display = 'block';
    }
});

// Функция закрытия
function closeAdminPanel() {
    adminOverlay.style.display = 'none';
    errorMessage.style.display = 'none';
    document.getElementById('adminLogin').value = '';
    document.getElementById('adminPassword').value = '';
}

// Закрытие по ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && adminOverlay.style.display === 'flex') {
        closeAdminPanel();
    }
});



