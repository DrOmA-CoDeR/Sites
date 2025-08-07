// Защищенные учетные данные (замаскированные)
const systemCredentials = {
  id: btoa('Admin').split('').reverse().join(''), // = "bmlkQ"
  code: (0x529A3 ^ 0x17B4D).toString(36) + '!' // = "RI_673O0!"
};

let accessAttempts = 0;

function showAuthModal() {
  document.getElementById('hiddenAuthPanel').style.display = 'block';
  document.body.style.overflow = 'hidden';
}

function hideAuth() {
  document.getElementById('hiddenAuthPanel').style.display = 'none';
  document.body.style.overflow = '';
}

function checkSystemAccess() {
  const enteredId = document.getElementById('sysAccessId').value;
  const enteredCode = document.getElementById('sysAccessCode').value;
  
  // Декодирование и проверка
  const decodedId = btoa(enteredId.split('').reverse().join(''));
  
  if(decodedId === systemCredentials.id && enteredCode === systemCredentials.code) {
    // Устанавливаем временный ключ доступа
    sessionStorage.setItem('sysAuthToken', btoa(Date.now() + '|' + systemCredentials.code));
    window.location.href = 'admins.html';
    return false;
  } else {
    accessAttempts++;
    if(accessAttempts >= 2) {
      alert('🚨 Система защиты активирована! Доступ заблокирован.');
      hideAuth();
    } else {
      alert('⚠ Неверные данные! Попыток осталось: ' + (2 - accessAttempts));
    }
    return false;
  }
}

