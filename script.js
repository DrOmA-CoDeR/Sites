document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('.transition-link');
    const overlay = document.querySelector('.transition-overlay');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            
            // Запускаем анимацию перехода
            overlay.style.opacity = '1';
            
            // Переход после 0.6 секунд (как в CSS)
            setTimeout(() => {
                window.location.href = href;
            }, 600);
        });
    });
    
    // Плавное появление страницы при загрузке
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 50);
});