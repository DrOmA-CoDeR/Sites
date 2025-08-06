// Конфигурация администратора
const ADMIN_CREDENTIALS = {
    login: "admin",
    password: "rzd2023"
};
const CORRECT_HASH = "e0803a3b28162b1776c24fd4d5ac2cbc2f34cbcf179581bbafb4082bcb011103"; // Хеш от пароля "123"
async function checkPassword() {
  const input = document.getElementById("passwordInput").value;
  
  // Хешируем введённый пароль
  const inputHash = await hashPassword(input);
  
  // Сравниваем с правильным хешем
  if (inputHash === CORRECT_HASH) {
    alert("Доступ разрешён!");
    // Здесь можно перенаправить на защищённую страницу
  } else {
    alert("Неверный пароль!");
  }
}

// Функция для хеширования (SHA-256)
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

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



