// Хеширование SHA-256
async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

// Открытие модального окна
function openAdminPanel() {
    const modal = document.getElementById('adminModal');
    modal.style.display = 'flex';
    // Очищаем поля при открытии
    document.getElementById('adminLogin').value = '';
    document.getElementById('adminPassword').value = '';
    // Удаляем предыдущие сообщения об ошибке
    const errors = document.querySelectorAll('.error-message');
    errors.forEach(error => error.remove());
}

// Закрытие модального окна
function closeAdminModal() {
    const modal = document.getElementById('adminModal');
    modal.style.animation = 'fadeOut 0.4s ease-out';
    setTimeout(() => {
        modal.style.display = 'none';
        modal.style.animation = 'fadeIn 0.4s ease-out';
    }, 400);
}

// Показать сообщение об ошибке
function showError(message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    errorElement.style.color = '#ff5555';
    errorElement.style.marginTop = '15px';
    errorElement.style.animation = 'fadeIn 0.3s ease-out';
    
    const loginBox = document.querySelector('.admin-login-box');
    loginBox.appendChild(errorElement);
}

// Проверка учетных данных
async function checkAdminCredentials() {
    const login = document.getElementById('adminLogin').value.trim();
    const password = document.getElementById('adminPassword').value.trim();
    
    // Очищаем предыдущие сообщения об ошибке
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(el => el.remove());
    
    if (!login || !password) {
        showError('Все поля должны быть заполнены');
        return;
    }
    
    try {
        // Хешируем введенный пароль
        const hashedPassword = await sha256(password);
        
        // Хеш пароля "Undant1" (предварительно вычисленный)
        const correctHashedPassword = '3f06fe71cb25ecc8f6e7d14e27c1739b3090d62065b7de0a3c5d4900efe90bf5';
        
        if (login === 'Admin' && hashedPassword === correctHashedPassword) {
            // Успешная авторизация - переходим на страницу администратора
            window.location.href = 'Admins.html';
        } else {
            showError('Неверный логин или пароль');
        }
    } catch (error) {
        showError('Ошибка при проверке данных');
        console.error('Authentication error:', error);
    }
}

// Добавляем крестик для закрытия в модальное окно
document.addEventListener('DOMContentLoaded', function() {
    const loginBox = document.querySelector('.admin-login-box');
    
    // Создаем элемент крестика
    const closeButton = document.createElement('span');
    closeButton.innerHTML = '&times;';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '15px';
    closeButton.style.right = '20px';
    closeButton.style.fontSize = '28px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.color = '#00aa00';
    closeButton.style.transition = 'color 0.3s';
    
    closeButton.onmouseover = function() {
        this.style.color = '#00ff00';
    };
    
    closeButton.onmouseout = function() {
        this.style.color = '#00aa00';
    };
    
    closeButton.onclick = closeAdminModal;
    
    // Добавляем крестик в модальное окно
    loginBox.insertBefore(closeButton, loginBox.firstChild);
    
    // Закрытие по клику вне модального окна
    const modal = document.getElementById('adminModal');
    modal.onclick = function(e) {
        if (e.target === modal) {
            closeAdminModal();
        }
    };
    
    // Обработка нажатия Enter в полях ввода
    document.getElementById('adminPassword').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            checkAdminCredentials();
        }
    });
});