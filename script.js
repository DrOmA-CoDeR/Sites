// Конфигурация безопасности 
const SECURITY_CONFIG = {
  SALT: "RZD_SECURE_SALT_" + (new Date().getFullYear()),
  TOKEN_PREFIX: "rzd_auth_v3_",
  MAX_ATTEMPTS: 3,
  TOKEN_LIFETIME: 3600000 // 1 час
};

let loginAttempts = 0;

// Функция открытия модального окна
function openAdminPanel() {
  const modal = document.getElementById('adminModal');
  modal.style.display = 'flex';
  
  // Добавляем обработчик закрытия по клику вне окна
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      closeAdminModal();
    }
  });
  
  // Добавляем кнопку закрытия
  const closeBtn = modal.querySelector('.fa-rectangle-xmark');
  closeBtn.addEventListener('click', closeAdminModal);
}

// Функция закрытия модального окна
function closeAdminModal() {
  const modal = document.getElementById('adminModal');
  modal.style.animation = 'fadeOut 0.3s ease-out';
  setTimeout(() => {
    modal.style.display = 'none';
    modal.style.animation = '';
  }, 300);
}

// Генерация токена
function generateSecureToken(login) {
  const timestamp = Date.now();
  const userAgentHash = sha256(navigator.userAgent + SECURITY_CONFIG.SALT).substr(0, 16);
  return `${SECURITY_CONFIG.TOKEN_PREFIX}${timestamp}_${userAgentHash}`;
}

// Проверка учетных данных
function checkAdminCredentials() {
  const login = document.getElementById('adminLogin').value.trim();
  const password = document.getElementById('adminPassword').value;

  if (loginAttempts >= SECURITY_CONFIG.MAX_ATTEMPTS) {
    alert('Доступ заблокирован. Слишком много попыток.');
    return;
  }

  // Хеширование с солью
  const hashedLogin = sha256(login + SECURITY_CONFIG.SALT);
  const hashedPassword = sha256(password + SECURITY_CONFIG.SALT);

  if (hashedLogin === "c1c224b03cd9bc7b6a86d77f5dace40191766c485cd55dc48caf9ac873335d6f" && 
      hashedPassword === "3f06fe71cb25ecc8f6e7d14e27c1739b3090d62065b7de0a3c5d4900efe90bf5") {
    
    const authToken = generateSecureToken(login);
    
    // Сохранение токена
    sessionStorage.setItem('adminAuthToken', authToken);
    document.cookie = `adminToken=${authToken}; path=/; SameSite=Strict; max-age=3600`;
    
    window.location.replace("Admins.html");
  } else {
    loginAttempts++;
    alert(`Неверные учетные данные! Осталось попыток: ${SECURITY_CONFIG.MAX_ATTEMPTS - loginAttempts}`);
    
    // Анимация ошибки
    const inputs = document.querySelectorAll('.admin-login-input');
    inputs.forEach(input => {
      input.style.animation = 'shake 0.5s';
      setTimeout(() => input.style.animation = '', 500);
    });
  }
}
// Функция открытия модального окна
function openAdminPanel() {
  const modal = document.getElementById('adminModal');
  modal.style.display = 'flex';
  
  // Добавляем обработчик закрытия по клику вне окна
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      closeAdminModal();
    }
  });
    // Добавляем кнопку закрытия
  const closeBtn = modal.querySelector('.fa-rectangle-xmark');
  closeBtn.addEventListener('click', closeAdminModal);
}

// Функция закрытия модального окна
function closeAdminModal() {
  const modal = document.getElementById('adminModal');
  modal.style.animation = 'fadeOut 0.3s ease-out';
  setTimeout(() => {
    modal.style.display = 'none';
    modal.style.animation = '';
  }, 300);
}
