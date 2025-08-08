// Конфигурация безопасности
const SECURITY_CONFIG = {
  SALT: "RZD_SECURE_SALT_" + (new Date().getFullYear()),
  TOKEN_VERSION: "v3",
  MAX_ATTEMPTS: 3,
  TOKEN_LIFETIME: 3600000 // 1 час в миллисекундах
};

// Глобальные переменные
let loginAttempts = 0;
let lastFailedAttempt = 0;

// Генерация защищенного токена
function generateSecureToken(login) {
  const timestamp = Date.now();
  const randomPart = crypto.getRandomValues(new Uint32Array(1))[0].toString(36);
  
  return [
    SECURITY_CONFIG.TOKEN_VERSION,
    sha256(login + SECURITY_CONFIG.SALT + timestamp),
    btoa(timestamp),
    sha256(randomPart + navigator.userAgent + SECURITY_CONFIG.SALT)
  ].join('.');
}

// Проверка учетных данных
function checkAdminCredentials() {
  // Защита от brute-force
  const now = Date.now();
  if (now - lastFailedAttempt < 5000) {
    alert("Слишком частые попытки входа. Подождите 5 секунд.");
    return;
  }

  if (loginAttempts >= SECURITY_CONFIG.MAX_ATTEMPTS) {
    alert(`Доступ заблокирован. Превышено количество попыток.`);
    document.getElementById('adminLogin').disabled = true;
    document.getElementById('adminPassword').disabled = true;
    return;
  }

  const login = document.getElementById('adminLogin').value.trim();
  const password = document.getElementById('adminPassword').value;

  // Хеширование с солью
  const hashedLogin = sha256(login + SECURITY_CONFIG.SALT);
  const hashedPassword = sha256(password + SECURITY_CONFIG.SALT);

  // Проверка учетных данных (замените значения на свои)
  if (hashedLogin === "c1c224b03cd9bc7b6a86d77f5dace40191766c485cd55dc48caf9ac873335d6f" && 
      hashedPassword === "3f06fe71cb25ecc8f6e7d14e27c1739b3090d62065b7de0a3c5d4900efe90bf5") {
    
    // Генерация токена
    const authToken = generateSecureToken(login);
    
    // Сохранение токена
    sessionStorage.setItem('adminAuthToken', authToken);
    document.cookie = `adminToken=${authToken}; path=/; SameSite=Strict; max-age=3600; Secure`;
    
    // Перенаправление с очисткой истории
    window.location.replace("Admins.html");
  } else {
    loginAttempts++;
    lastFailedAttempt = now;
    alert(`Неверные учетные данные! Осталось попыток: ${SECURITY_CONFIG.MAX_ATTEMPTS - loginAttempts}`);
    
    // Анимация ошибки
    const inputs = document.querySelectorAll('.admin-login-input');
    inputs.forEach(input => {
      input.style.animation = 'shake 0.5s';
      setTimeout(() => input.style.animation = '', 500);
    });
  }
}

// Закрытие модального окна
function closeAdminModal() {
  const modal = document.getElementById('adminModal');
  modal.style.animation = 'fadeOut 0.3s ease-out';
  setTimeout(() => {
    modal.style.display = 'none';
    modal.style.animation = '';
  }, 300);
}
