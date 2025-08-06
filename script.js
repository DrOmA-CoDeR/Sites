document.addEventListener('DOMContentLoaded', () => {
    // Плавное появление страницы при загрузке
    document.body.classList.add('fade-in');

    // Плавный переход при клике на ссылки
    const links = document.querySelectorAll('a:not([target="_blank"])'); // Все ссылки, кроме открывающихся в новой вкладке
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            
            // Плавное исчезновение
            document.body.classList.remove('fade-in');
            document.body.classList.add('fade-out');
            
            // Переход после анимации
            setTimeout(() => {
                window.location.href = href;
            }, 500); // 0.5s = время анимации
        });
    });
});
