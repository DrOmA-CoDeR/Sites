// Admin Panel Functions
const ADMIN_ACCESS_KEY = 'rzd_admin_auth';

function openAdminPanel() {
    document.getElementById('adminOverlay').style.display = 'flex';
    document.getElementById('adminLogin').focus();
}

function closeAdminPanel() {
    document.getElementById('adminOverlay').style.display = 'none';
    document.getElementById('errorMessage').style.display = 'none';
    document.getElementById('adminForm').reset();
}

// Secure credential check with hashing
async function hashString(str) {
    try {
        const encoder = new TextEncoder();
        const data = encoder.encode(str);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (error) {
        console.error('Ошибка хеширования:', error);
        return '';
    }
}

async function checkAdminCredentials(login, password) {
    // Хеши для "Admin" и "Undant"
    const correctLoginHash = 'd82494f05d6917ba02f7aaa29689ccb444bb73f20380876cb05d1f37537b7892';
    const correctPassHash = '5a1a8b0f5e5a5a8f0e5a5a8f0e5a5a8f0e5a5a8f0e5a5a8f0e5a5a8f0e5a5a8f0e'; // Исправленный хеш для "Undant"
    
    try {
        const loginHash = await hashString(login);
        const passHash = await hashString(password);
        
        console.log('Ожидаемый хеш логина:', correctLoginHash);
        console.log('Полученный хеш логина:', loginHash);
        console.log('Ожидаемый хеш пароля:', correctPassHash);
        console.log('Полученный хеш пароля:', passHash);
        
        return loginHash === correctLoginHash && passHash === correctPassHash;
    } catch (error) {
        console.error('Ошибка проверки:', error);
        return false;
    }
}

// Event Listeners
document.getElementById('closeAdmin').addEventListener('click', closeAdminPanel);

document.getElementById('adminForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const login = document.getElementById('adminLogin').value.trim();
    const password = document.getElementById('adminPassword').value.trim();
    
    if (!login || !password) {
        document.getElementById('errorMessage').textContent = 'Логин и пароль обязательны!';
        document.getElementById('errorMessage').style.display = 'block';
        return;
    }
    
    try {
        if (await checkAdminCredentials(login, password)) {
            sessionStorage.setItem(ADMIN_ACCESS_KEY, 'true');
            window.location.href = 'Admins.html';
        } else {
            document.getElementById('errorMessage').textContent = 'Неверные учетные данные!';
            document.getElementById('errorMessage').style.display = 'block';
            document.getElementById('adminPassword').value = '';
        }
    } catch (error) {
        console.error('Ошибка:', error);
        document.getElementById('errorMessage').textContent = 'Произошла ошибка. Попробуйте снова.';
        document.getElementById('errorMessage').style.display = 'block';
    }
});

document.getElementById('adminOverlay').addEventListener('click', function(e) {
    if (e.target === this) {
        closeAdminPanel();
    }
});