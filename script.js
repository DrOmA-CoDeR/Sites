// Глобальные переменные
let loginAttempts = 0;
const MAX_ATTEMPTS = 3;
const SECRET_KEY = "RZD_AUTH_" + new Date().getFullYear();

// Открытие/закрытие модалки
function openAdminPanel() {
    document.getElementById('adminModal').style.display = 'flex';
}

function closeAdminModal() {
    const modal = document.getElementById('adminModal');
    modal.style.animation = 'fadeOut 0.3s ease-out';
    setTimeout(() => {
        modal.style.display = 'none';
        modal.style.animation = '';
    }, 300);
}

// Проверка учетных данных
function checkAdminCredentials() {
    if(loginAttempts >= MAX_ATTEMPTS) {
        alert('Доступ заблокирован. Слишком много попыток.');
        document.getElementById('adminLogin').disabled = true;
        document.getElementById('adminPassword').disabled = true;
        return;
    }

    const login = document.getElementById('adminLogin').value.trim();
    const password = document.getElementById('adminPassword').value;

    // Хеширование с солью
    const hashedLogin = sha256(login + SECRET_KEY);
    const hashedPassword = sha256(password + SECRET_KEY);

    // Проверка (значения должны совпадать с Admins.html)
    if(hashedLogin === "c1c224b03cd9bc7b6a86d77f5dace40191766c485cd55dc48caf9ac873335d6f" && 
       hashedPassword === "3f06fe71cb25ecc8f6e7d14e27c1739b3090d62065b7de0a3c5d4900efe90bf5") {
        
        // Генерируем временный ключ доступа
        const authToken = sha256(SECRET_KEY + Date.now());
        sessionStorage.setItem('adminAuth', authToken);
        
        // Перенаправляем с очисткой истории
        window.location.href = "Admins.html";
    } else {
        loginAttempts++;
        alert(`Неверные данные! Осталось попыток: ${MAX_ATTEMPTS - loginAttempts}`);
        
        // Анимация ошибки
        document.querySelectorAll('.admin-login-input').forEach(input => {
            input.style.animation = 'shake 0.5s';
            setTimeout(() => input.style.animation = '', 500);
        });
    }
}