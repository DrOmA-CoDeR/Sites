// Функция для открытия модального окна администрации
function openAdminPanel() {
  const modal = document.getElementById('adminModal');
  modal.style.display = 'block';
  document.body.style.overflow = 'hidden'; // Блокировка прокрутки
  document.getElementById('adminUsername').focus();
}


document.querySelector('.admin-close').addEventListener('click', function() {
  document.getElementById('adminModal').style.display = 'none';
  document.body.style.overflow = ''; // Восстановление прокрутки
});


document.getElementById('adminLoginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  
  const credentials = {
    u: atob('QWRtaW4='), 
    p: ['RI_', 54,55,51,79,48, '!'].join('').replace(/,/g, String.fromCharCode) 
  };
  
  const username = document.getElementById('adminUsername').value.trim();
  const password = document.getElementById('adminPassword').value;
  
  if(username === credentials.u && password === credentials.p) {
    window.location.href = 'Admins.html';
  } else {
    let attempts = parseInt(sessionStorage.getItem('adminAttempts') || 0;
    attempts++;
    sessionStorage.setItem('adminAttempts', attempts.toString());
    
    if(attempts >= 2) {
      alert('⚠️ Доступ запрещен! Неверные учетные данные.');
      document.getElementById('adminModal').style.display = 'none';
      document.body.style.overflow = '';
      sessionStorage.removeItem('adminAttempts');
    } else {
      alert(`❌ Неверный логин/пароль! Осталось ${2 - attempts} попытки.`);
      document.getElementById('adminPassword').value = '';
      document.getElementById('adminPassword').focus();
    }
  }
});

// Закрытие при клике вне модального окна
window.addEventListener('click', function(event) {
  const modal = document.getElementById('adminModal');
  if(event.target === modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
});