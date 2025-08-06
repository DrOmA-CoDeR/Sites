// Функция для открытия панели (должна быть глобальной)
function openAdminPanel() {
    const adminOverlay = document.getElementById('adminOverlay');
    if (adminOverlay) {
        adminOverlay.style.display = 'flex';
        const emailInput = document.getElementById('adminEmail');
        if (emailInput) emailInput.focus();
    }
}

// Обработчики событий после загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    // Элементы
    const closeBtn = document.getElementById('closeAdminPanel');
    const loginBtn = document.getElementById('adminLoginBtn');
    const errorMsg = document.getElementById('loginError');

    // Закрытие панели
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            const adminOverlay = document.getElementById('adminOverlay');
            if (adminOverlay) adminOverlay.style.display = 'none';
            if (errorMsg) errorMsg.textContent = '';
        });
    }

    // Вход
    if (loginBtn) {
        loginBtn.addEventListener('click', async () => {
            const email = document.getElementById('adminEmail')?.value || '';
            const password = document.getElementById('adminPassword')?.value || '';

            try {
                const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
                window.location.href = "Admins.html";
            } catch (error) {
                if (errorMsg) {
                    errorMsg.textContent = getErrorMessage(error.code);
                }
            }
        });
    }

    // Показ ошибок
    function getErrorMessage(code) {
        const messages = {
            'auth/invalid-email': 'Неверный формат email',
            'auth/user-not-found': 'Пользователь не найден',
            'auth/wrong-password': 'Неверный пароль',
            'auth/too-many-requests': 'Слишком много попыток. Попробуйте позже'
        };
        return messages[code] || 'Ошибка входа';
    }
});