document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('.transition-link');
    const overlay = document.querySelector('.transition-overlay');
    const particles = document.querySelector('.particles');
    const shardsContainer = document.querySelector('.shards');

    // Создаём осколки
    function createShards() {
        const shardCount = 20;
        for (let i = 0; i < shardCount; i++) {
            const shard = document.createElement('div');
            shard.className = 'shard';
            shard.style.width = `${Math.random() * 100 + 50}px`;
            shard.style.height = `${Math.random() * 100 + 50}px`;
            shard.style.left = `${Math.random() * 100}%`;
            shard.style.top = `${Math.random() * 100}%`;
            shardsContainer.appendChild(shard);
        }
    }

    // Анимация перехода
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');

            // Показываем overlay
            gsap.to(overlay, { opacity: 1, duration: 0.5 });

            // Анимация частиц
            gsap.to(particles, { 
                opacity: 0.8,
                duration: 1,
                ease: "power2.out"
            });

            // 3D-разлёт осколков
            gsap.to(".shard", {
                x: () => Math.random() * 1000 - 500,
                y: () => Math.random() * 1000 - 500,
                rotation: () => Math.random() * 360,
                scale: 0,
                opacity: 1,
                duration: 1.5,
                stagger: 0.1,
                ease: "power4.out",
                onComplete: () => {
                    window.location.href = href;
                }
            });
        });
    });

    // Инициализация
    createShards();
});