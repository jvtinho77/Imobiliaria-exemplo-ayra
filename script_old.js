// Interception Observer for scroll reveals (movimento e aparição)
const revealElements = document.querySelectorAll('.reveal-up');

const revealOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const revealOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            return;
        } else {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        }
    });
}, revealOptions);

revealElements.forEach(el => {
    revealOnScroll.observe(el);
});

// Video Hero - Mostrar conteúdo após 3 segundos
const heroVideo = document.querySelector('.hero-video');
const videoContent = document.querySelector('.video-content');

if (heroVideo && videoContent) {
    // Quando o vídeo começar a tocar
    heroVideo.addEventListener('play', () => {
        // Aguardar exatamente 3 segundos e mostrar o conteúdo
        setTimeout(() => {
            videoContent.classList.add('show');
        }, 3000);
    });

    // Caso o vídeo já esteja carregado/tocando quando o DOM estiver pronto
    if (heroVideo.readyState >= 3) {
        // Se o vídeo já começou, calcula o tempo restante
        const currentTime = heroVideo.currentTime;
        const remainingTime = Math.max(0, 3000 - (currentTime * 1000));

        setTimeout(() => {
            videoContent.classList.add('show');
        }, remainingTime);
    }
}

// Efeito Parallax 3D com movimento do mouse
const hero = document.querySelector('.hero');
const mainGlow = document.querySelector('.main-glow');

if(hero) {
    hero.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;

        // Calcular rotação suave (-5 a 5 graus)
        const rotateX = (y - 0.5) * -10;
        const rotateY = (x - 0.5) * 10;

        // Mover o glow de ambiente
        if (mainGlow) {
            mainGlow.style.transform = `translate(${x * 50}px, ${y * 50}px) scale(${1 + x * 0.2})`;
        }

        // Aplicar rotação sutil ao conteúdo do hero
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.transform = `
                perspective(1200px)
                translateZ(50px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
            `;
        }
    });

    // Resetar quando o mouse sair
    hero.addEventListener('mouseleave', () => {
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.transform = 'perspective(1200px) translateZ(50px) rotateX(0) rotateY(0)';
        }
    });
}

// Efeito 3D nos cards ao passar o mouse
const propertyCards = document.querySelectorAll('.property-card');

propertyCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `
            translateY(-20px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            scale(1.02)
        `;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) rotateX(0) rotateY(0) scale(1)';
    });
});

// Navbar dynamic styling on scroll
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if(window.scrollY > 50) {
        navbar.style.background = 'rgba(13, 10, 9, 0.85)';
        navbar.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.8)';
    } else {
        navbar.style.background = 'rgba(23, 19, 17, 0.5)';
        navbar.style.boxShadow = '0 20px 50px rgba(0, 0, 0, 0.5)';
    }
});
