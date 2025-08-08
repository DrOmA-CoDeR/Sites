// Функции для административного входа
let loginAttempts = 0;
const MAX_ATTEMPTS = 3;

function openAdminPanel() {
    document.getElementById('adminModal').style.display = 'flex';
}

function checkAdminCredentials() {
    if(loginAttempts >= MAX_ATTEMPTS) {
        alert('Доступ заблокирован. Слишком много попыток.');
        return;
    }

    const login = document.getElementById('adminLogin').value;
    const password = document.getElementById('adminPassword').value;
    
    // Хешированные учетные данные (замените на свои)
    const correctHashedLogin = 'c1c224b03cd9bc7b6a86d77f5dace40191766c485cd55dc48caf9ac873335d6f'; // SHA-256 от 'Admin'
    const correctHashedPassword = '3f06fe71cb25ecc8f6e7d14e27c1739b3090d62065b7de0a3c5d4900efe90bf5'; // Замените на SHA-256 хеш вашего пароля
    
    // Хешируем введенные данные
    const hashedLogin = sha256(login);
    const hashedPassword = sha256(password);
    
    if(hashedLogin === correctHashedLogin && hashedPassword === correctHashedPassword) {
        // Генерируем токен доступа
        const authToken = 'auth_' + Math.random().toString(36).substr(2, 16) + sha256(Date.now().toString());
        sessionStorage.setItem('adminAuthToken', authToken);
        window.location.href = 'Admins.html';
    } else {
        loginAttempts++;
        alert(`Неверные учетные данные! Осталось попыток: ${MAX_ATTEMPTS - loginAttempts}`);
    }
}

function closeAdminModal() {
    const modal = document.getElementById('adminModal');
    modal.style.animation = 'fadeOut 0.3s ease-out';
    setTimeout(() => {
        modal.style.display = 'none';
        modal.style.animation = '';
    }, 300);
}

function checkAdminCredentials() {
  const login = document.getElementById('adminLogin').value;
  const password = document.getElementById('adminPassword').value;
  
  if (login === "Admin" && password === "ваш_пароль") {
    // Отправляем скрытую форму вместо перенаправления
    document.getElementById('secretAdminForm').submit();
  } else {
    alert("Неверные учетные данные!");
    // Ваш существующий код анимации ошибки
  }
}