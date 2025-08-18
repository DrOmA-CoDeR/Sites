let failedAttempts = 0;
const MAX_ATTEMPTS = 2;
const BLOCK_TIME_MS = 5 * 60 * 1000; // 5 минут блокировки
let blockUntil = 0;

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
    // Проверяем не заблокирован ли доступ
    if (localStorage.getItem('blockUntil') && Date.now() < localStorage.getItem('blockUntil')) {
        showBlockedMessage();
        return;
    }

    const modal = document.getElementById('adminModal');
    modal.style.display = 'flex';
    // Восстанавливаем стандартный интерфейс
    modal.innerHTML = `
        <div class="admin-login-box">
            <span class="close-modal" onclick="closeAdminModal()">&times;</span>
            <div class="admin-login-header">
                <h2><i class="fas fa-lock"></i> Аутентификация</h2>
                <p>Доступ только для Администрации</p></div>
            
            <div class="input-group">
                <label for="adminLogin"><i class="fas fa-user"></i> Логин:</label>
                <input type="text" id="adminLogin" class="admin-login-input" placeholder="Введите логин">
            </div>
            
            <div class="input-group">
                <label for="adminPassword"><i class="fas fa-key"></i> Пароль:</label>
                <input type="password" id="adminPassword" class="admin-login-input" placeholder="Введите пароль">
            </div>
            
            <button onclick="checkAdminCredentials()" class="admin-login-btn">
                <i class="fas fa-sign-in-alt"></i> Войти
            </button>
            
            <div class="security-info">
                <p><i class="fas fa-shield-alt"></i> Все попытки входа регистрируются! </p>
            </div>
        </div>
    `;
    
    // Добавляем обработчики событий для нового содержимого
    document.getElementById('adminPassword').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') checkAdminCredentials();
    });
}

// Показать сообщение о блокировке
function showBlockedMessage() {
    const modal = document.getElementById('adminModal');
    modal.style.display = 'flex';
    
    const blockTime = parseInt(localStorage.getItem('blockUntil')) || 0;
    const remainingTime = Math.max(0, blockTime - Date.now());
    const minutes = Math.ceil(remainingTime / (60 * 1000));
    
    modal.innerHTML = `
        <div class="admin-login-box blocked-box">
            <div class="admin-login-header">
                <h2><i class="fas fa-ban" style="color: #ff5555;"></i> Доступ ограничен</h2>
                <p>Слишком много неудачных попыток входа, ваш ip-адрес отправлен админитсртору. Если попытки возобновлялся вы будите заблокированы! </p>
            </div>
            
            <div class="blocked-timer">
                <i class="fas fa-clock"></i>
                <p>Попробуйте снова через: <span id="timer">${minutes}</span> мин.</p>
            </div>
            
            <div class="security-info">
                <p><i class="fas fa-shield-alt"></i> Система безопасности активирована</p>
            </div>
        </div>
    `;
    
    // Обновляем таймер каждую минуту
    const timerElement = document.getElementById('timer');
    const timerInterval = setInterval(() => {
        const remaining = Math.max(0, blockTime - Date.now());
        const mins = Math.ceil(remaining / (60 * 1000));
        timerElement.textContent = mins;
        
        if (remaining <= 0) {
            clearInterval(timerInterval);
            closeAdminModal();
        }
    }, 60000);
}

// Проверка учетных данных
async function checkAdminCredentials() {
    // Проверяем блокировку
    if (localStorage.getItem('blockUntil') && Date.now() < localStorage.getItem('blockUntil')) {
        showBlockedMessage();
        return;
    }

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
        const hashedPassword = await sha256(password);
        const correctHashedPassword = '3f06fe71cb25ecc8f6e7d14e27c1739b3090d62065b7de0a3c5d4900efe90bf5';
        
        if (login === 'Admin' && hashedPassword === correctHashedPassword) {
            // Сброс счетчика при успешном входе
            failedAttempts = 0;
            localStorage.removeItem('blockUntil');
            window.location.href = 'login.html';
        } else {
            failedAttempts++;
            
            if (failedAttempts >= MAX_ATTEMPTS) {
                // Устанавливаем блокировку
                const blockTime = Date.now() + BLOCK_TIME_MS;
                localStorage.setItem('blockUntil', blockTime);
                showBlockedMessage();
            } else {
                showError(`Неверный логин или пароль. Осталось попыток: ${MAX_ATTEMPTS - failedAttempts}`);
            }
        }
    } catch (error) {
        showError('Ошибка при проверке данных');
        console.error('Authentication error:', error);
    }
}


// Остальные функции (closeAdminModal, showError) остаются без изменений

// Проверка статуса блокировки
async function checkBlockStatus() {
    const securityData = await getSecurityData();
    const userFingerprint = await getFingerprint();

    // Проверка перманентной блокировки
    if (securityData.permBlocks.includes(userFingerprint)) {
        showBlock("Ваш аккаунт заблокирован навсегда");
        return true;
    }

    // Проверка временной блокировки
    const userBlocks = securityData.blocks.filter(b =>
        b.fingerprint === userFingerprint &&
        b.expires > Date.now()
    );

    if (userBlocks.length > 0) {
        const block = userBlocks[0];
        const timeLeft = Math.ceil((block.expires - Date.now()) / (60 * 1000));
        showBlock(`Временная блокировка (осталось ${timeLeft} мин.)`, block.expires);
        return true;
    }

    // Проверка блокировки по IP (новый код)
    const clientIp = await getClientIP();
    const ipBlocks = securityData.blocks.filter(b =>
        b.ip === clientIp &&
        b.expires > Date.now()
    );

    if (ipBlocks.length > 0) {
        const block = ipBlocks[0];
        const timeLeft = Math.ceil((block.expires - Date.now()) / (60 * 1000));
        showBlock(`Ваш IP заблокирован (осталось ${timeLeft} мин.)`, block.expires);
        return true;
    }

    return false;
}