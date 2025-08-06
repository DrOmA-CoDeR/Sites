// Функция для открытия модального окна администрации
function openAdminPanel() {
  const modal = document.getElementById('adminModal');
  modal.style.display = 'block';
  document.getElementById('adminUsername').focus();
}

// Закрытие модального окна
document.querySelector('.admin-close').addEventListener('click', function() {
  document.getElementById('adminModal').style.display = 'none';
});

// Обработка отправки формы
document.getElementById('adminLoginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  // Запутанные данные для входа (замаскированные)
  const correctUsername = atob('QWRtaW4='); // Admin
  const correctPassword = 'RI_' + String.fromCharCode(54,55,51,79,48) + '!'; // RI_673O0!
  
  const username = document.getElementById('adminUsername').value;
  const password = document.getElementById('adminPassword').value;
  
  if(username === correctUsername && password === correctPassword) {
    window.location.href = 'Admins.html';
  } else {
    let attempts = parseInt(sessionStorage.getItem('adminAttempts') || '0');
    attempts++;
    sessionStorage.setItem('adminAttempts', attempts.toString());
    
    if(attempts >= 2) {
      alert('⚠️ Неверные данные! Доступ заблокирован.');
      document.getElementById('adminModal').style.display = 'none';
      sessionStorage.removeItem('adminAttempts');
    } else {
      alert('❌ Неверный логин или пароль! Осталось попыток: ' + (2 - attempts));
    }
  }
});

// Закрытие при клике вне модального окна
window.addEventListener('click', function(event) {
  const modal = document.getElementById('adminModal');
  if(event.target === modal) {
    modal.style.display = 'none';
  }
});