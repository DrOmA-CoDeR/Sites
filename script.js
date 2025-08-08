// Конфигурация безопасности (должна совпадать на обеих страницах)
const SECURITY_CONFIG = {
  SALT: "RZD_SECURE_SALT_" + (new Date().getFullYear()),
  TOKEN_PREFIX: "rzd_auth_v3_",
  MAX_ATTEMPTS: 3,
  TOKEN_LIFETIME: 3600000 // 1 час
};

// Генерация токена (обновленная версия)
function generateSecureToken(login) {
  const timestamp = Date.now();
  const userAgentHash = sha256(navigator.userAgent + SECURITY_CONFIG.SALT).substr(0, 16);
  return `${SECURITY_CONFIG.TOKEN_PREFIX}${timestamp}_${userAgentHash}`;
}

// Проверка учетных данных
function checkAdminCredentials() {
  const login = document.getElementById('adminLogin').value.trim();
  const password = document.getElementById('adminPassword').value;

  // Хеширование с солью
  const hashedLogin = sha256(login + SECURITY_CONFIG.SALT);
  const hashedPassword = sha256(password + SECURITY_CONFIG.SALT);

  // Проверка учетных данных
  if (hashedLogin === "c1c224b03cd9bc7b6a86d77f5dace40191766c485cd55dc48caf9ac873335d6f" && 
      hashedPassword === "3f06fe71cb25ecc8f6e7d14e27c1739b3090d62065b7de0a3c5d4900efe90bf5") {
    
    const authToken = generateSecureToken(login);
    
    // Сохранение токена
    sessionStorage.setItem('adminAuthToken', authToken);
    document.cookie = `adminToken=${authToken}; path=/; SameSite=Strict; max-age=3600`;
    
    // Важно: Используем replace чтобы нельзя было вернуться назад
    window.location.replace("Admins.html");
  } else {
    alert("Неверные учетные данные!");
  }
}