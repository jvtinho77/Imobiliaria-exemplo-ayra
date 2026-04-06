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
    heroVideo.addEventListener('play', () => {
        setTimeout(() => {
            videoContent.classList.add('show');
        }, 3000);
    });

    if (heroVideo.readyState >= 3) {
        const currentTime = heroVideo.currentTime;
        const remainingTime = Math.max(0, 3000 - (currentTime * 1000));
        setTimeout(() => {
            videoContent.classList.add('show');
        }, remainingTime);
    }
}

// Efeito Parallax 3D com movimento do mouse - Usando requestAnimationFrame para fluidez
const hero = document.querySelector('.hero');
const mainGlow = document.querySelector('.main-glow');
let mouseX = 0.5;
let mouseY = 0.5;
let currentX = 0.5;
let currentY = 0.5;

if (hero) {
    hero.addEventListener('mousemove', (e) => {
        mouseX = e.clientX / window.innerWidth;
        mouseY = e.clientY / window.innerHeight;
    });

    hero.addEventListener('mouseleave', () => {
        mouseX = 0.5;
        mouseY = 0.5;
    });
}

// Animação suave com requestAnimationFrame
function animateHero() {
    // Interpolação suave (lerp) - mais lenta para suavidade
    currentX += (mouseX - currentX) * 0.05;
    currentY += (mouseY - currentY) * 0.05;

    if (mainGlow) {
        const glowX = (currentX - 0.5) * 80;
        const glowY = (currentY - 0.5) * 80;
        mainGlow.style.transform = `translate(${glowX}px, ${glowY}px)`;
    }

    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        const rotateX = (currentY - 0.5) * -4;
        const rotateY = (currentX - 0.5) * 4;
        heroContent.style.transform = `
            perspective(1200px)
            translateZ(50px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
        `;
    }

    requestAnimationFrame(animateHero);
}

// Iniciar animação
requestAnimationFrame(animateHero);

// Efeito 3D nos cards ao passar o mouse - Com requestAnimationFrame e retorno suave
const propertyCards = document.querySelectorAll('.property-card');

propertyCards.forEach(card => {
    let cardMouseX = 0.5;
    let cardMouseY = 0.5;
    let cardCurrentX = 0.5;
    let cardCurrentY = 0.5;
    let isHovering = false;
    let rafId = null;

    function animateCard() {
        // Interpolação suave
        cardCurrentX += (cardMouseX - cardCurrentX) * 0.08;
        cardCurrentY += (cardMouseY - cardCurrentY) * 0.08;

        // Calcular rotação baseada na posição interpolada
        const rotateX = (cardCurrentY - 0.5) * -12;
        const rotateY = (cardCurrentX - 0.5) * 12;

        // Fator de escala e elevação baseado no hover
        const elevation = isHovering ? -20 : 0;
        const scale = isHovering ? 1.02 : 1;

        card.style.transform = `
            translateY(${elevation}px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            scale(${scale})
        `;

        // Continuar animação enquanto não chegar no estado de repouso
        const isResting = Math.abs(cardCurrentX - 0.5) < 0.001 &&
                          Math.abs(cardCurrentY - 0.5) < 0.001 &&
                          !isHovering;

        if (!isResting) {
            rafId = requestAnimationFrame(animateCard);
        }
    }

    card.addEventListener('mouseenter', () => {
        isHovering = true;
        cancelAnimationFrame(rafId);
        animateCard();
    });

    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        cardMouseX = (e.clientX - rect.left) / rect.width;
        cardMouseY = (e.clientY - rect.top) / rect.height;
    });

    card.addEventListener('mouseleave', () => {
        isHovering = false;
        cardMouseX = 0.5;
        cardMouseY = 0.5;
        // Não cancela o animation frame, deixa retornar suavemente
        cancelAnimationFrame(rafId);
        animateCard();
    });
});

// Navbar dynamic styling on scroll - com throttle para performance
const navbar = document.querySelector('.navbar');
let lastScrollY = 0;
let ticking = false;

window.addEventListener('scroll', () => {
    lastScrollY = window.scrollY;

    if (!ticking) {
        requestAnimationFrame(() => {
            if (lastScrollY > 50) {
                navbar.style.background = 'rgba(13, 10, 9, 0.9)';
                navbar.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.8)';
            } else {
                navbar.style.background = 'rgba(23, 19, 17, 0.6)';
                navbar.style.boxShadow = '0 20px 50px rgba(0, 0, 0, 0.5)';
            }
            ticking = false;
        });
        ticking = true;
    }
});
