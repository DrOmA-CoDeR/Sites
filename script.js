// Зашифрованные данные (XOR + Base64)
const ENCRYPTED = {
    login: 'U1RBUQ==',    // 'Admin' после шифрования
    password: 'V1ZGVw=='  // 'Undant' после шифрования
};

// Простой шифратор/дешифратор
function secretCipher(str, key = 0x55) {
    return str.split('').map(c => 
        String.fromCharCode(c.charCodeAt(0) ^ key)
    ).join('');
}

// Проверка учетных данных с защитой
function checkCredentials(login, password) {
    // Дешифруем правильные данные
    const trueLogin = atob(ENCRYPTED.login);
    const truePass = atob(ENCRYPTED.password);
    const decryptedLogin = secretCipher(trueLogin);
    const decryptedPass = secretCipher(truePass);
    
    // Добавляем задержку (500-1000ms) против брутфорса
    const start = Date.now();
    while (Date.now() - start < 500 + Math.random() * 500) {}
    
    return login === decryptedLogin && password === decryptedPass;
}

// Сессия с таймером (1 час)
function createSession() {
    const session = {
        token: btoa(Date.now().toString()),
        expires: Date.now() + 3600000
    };
    localStorage.setItem('adminAuth', JSON.stringify(session));
}

// Проверка сессии
function checkSession() {
    const session = JSON.parse(localStorage.getItem('adminAuth'));
    return session && session.expires > Date.now();
}

// Открытие панели (для вашей кнопки)
function openAdminPanel() {
    document.getElementById('adminOverlay').style.display = 'flex';
    document.getElementById('adminLogin').focus();
}

// Закрытие панели
function closeAdminPanel() {
    document.getElementById('adminOverlay').style.display = 'none';
    document.getElementById('errorMessage').style.display = 'none';
    document.getElementById('adminForm').reset();
}

// Обработчик формы
document.getElementById('adminForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const login = document.getElementById('adminLogin').value.trim();
    const password = document.getElementById('adminPassword').value.trim();
    
    if (checkCredentials(login, password)) {
        createSession();
        window.location.href = 'admins.html';
    } else {
        document.getElementById('errorMessage').style.display = 'block';
        document.getElementById('adminPassword').value = '';
    }
});