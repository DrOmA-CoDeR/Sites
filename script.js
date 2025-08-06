// Обработка админ-панели
document.addEventListener('DOMContentLoaded', function() {
    // Правильные учетные данные 
    const ADMIN_CREDENTIALS = {
        login: "admin",
        password: "rzd2023"
    };

    /
    const adminPanel = document.querySelector('.admin-panel');
    const adminLoginBtn = document.querySelector('.fa-user-tie').closest('.card');
    const adminSubmitBtn = document.getElementById('admin-submit');
    const errorMessage = document.querySelector('.error-message');

    /
    adminLoginBtn.addEventListener('click', function(e) {
        e.preventDefault();
        adminPanel.style.display = 'block';
    });

   
    adminSubmitBtn.addEventListener('click', function() {
        const login = document.getElementById('admin-login').value;
        const password = document.getElementById('admin-password').value;
        
        if (login === ADMIN_CREDENTIALS.login && password === ADMIN_CREDENTIALS.password) {
            window.location.href = "Admins.html";
        } else {
            errorMessage.style.display = 'block';
        }
    });

    // Закрытие панели при клике вне ее
    document.addEventListener('click', function(e) {
        if (e.target === adminPanel || adminPanel.contains(e.target)) return;
        if (e.target === adminLoginBtn || adminLoginBtn.contains(e.target)) return;
        
        adminPanel.style.display = 'none';
        errorMessage.style.display = 'none';
    });
});