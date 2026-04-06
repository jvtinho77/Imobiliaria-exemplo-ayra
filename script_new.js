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
let mouseX = 0;
let mouseY = 0;
let currentX = 0;
let currentY = 0;

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
    // Interpolação suave (lerp)
    currentX += (mouseX - currentX) * 0.08;
    currentY += (mouseY - currentY) * 0.08;

    if (mainGlow) {
        const glowX = (currentX - 0.5) * 100;
        const glowY = (currentY - 0.5) * 100;
        mainGlow.style.transform = `translate(${glowX}px, ${glowY}px)`;
    }

    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        const rotateX = (currentY - 0.5) * -6;
        const rotateY = (currentX - 0.5) * 6;
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
mouseX = 0.5;
mouseY = 0.5;
requestAnimationFrame(animateHero);

// Efeito 3D nos cards ao passar o mouse - Com requestAnimationFrame
const propertyCards = document.querySelectorAll('.property-card');

propertyCards.forEach(card => {
    let cardMouseX = 0.5;
    let cardMouseY = 0.5;
    let cardCurrentX = 0.5;
    let cardCurrentY = 0.5;
    let isHovering = false;
    let rafId = null;

    function animateCard() {
        cardCurrentX += (cardMouseX - cardCurrentX) * 0.1;
        cardCurrentY += (cardMouseY - cardCurrentY) * 0.1;

        if (isHovering) {
            const rotateX = (cardCurrentY - 0.5) * -15;
            const rotateY = (cardCurrentX - 0.5) * 15;
            card.style.transform = `
                translateY(-20px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                scale(1.02)
            `;
        } else {
            card.style.transform = 'translateY(0) rotateX(0) rotateY(0) scale(1)';
        }

        if (isHovering || Math.abs(cardCurrentX - 0.5) > 0.001) {
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
        cancelAnimationFrame(rafId);
        card.style.transform = 'translateY(0) rotateX(0) rotateY(0) scale(1)';
    });
});

// Navbar dynamic styling on scroll
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(13, 10, 9, 0.9)';
        navbar.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.8)';
    } else {
        navbar.style.background = 'rgba(23, 19, 17, 0.6)';
        navbar.style.boxShadow = '0 20px 50px rgba(0, 0, 0, 0.5)';
    }
});
