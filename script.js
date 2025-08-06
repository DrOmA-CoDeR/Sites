// Инициализация Firebase (ЗАМЕНИТЕ НА ВАШИ ДАННЫЕ)
const firebaseConfig = {
  apiKey: "AIzaSyBM2aPWnY9zTYT31_uyxFLKjZuQAbFWdQ8",
  authDomain: "admins-c5c94.firebaseapp.com",
  projectId: "admins-c5c94",
  storageBucket: "admins-c5c94.firebasestorage.app",
  messagingSenderId: "279553104900",
  appId: "1:279553104900:web:b72a26d0227326c8042951"
};

// Инициализация
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Элементы
const adminOverlay = document.getElementById('adminOverlay');
const closeBtn = document.getElementById('closeAdminPanel');
const loginBtn = document.getElementById('adminLoginBtn');
const errorMsg = document.getElementById('loginError');

// Открытие панели (вызовите эту функцию при клике на вашу кнопку админа)
function openAdminPanel() {
  adminOverlay.style.display = 'flex';
  document.getElementById('adminEmail').focus();
}

// Закрытие панели
closeBtn.addEventListener('click', () => {
  adminOverlay.style.display = 'none';
  errorMsg.textContent = '';
});

// Вход
loginBtn.addEventListener('click', async () => {
  const email = document.getElementById('adminEmail').value;
  const password = document.getElementById('adminPassword').value;

  try {
    const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
    window.location.href = "Admins.html"; // Перенаправление при успехе
  } catch (error) {
    errorMsg.textContent = getErrorMessage(error.code);
  }
});

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