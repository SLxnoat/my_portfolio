// DOM Elements
const body = document.body;
const themeToggle = document.getElementById('theme-toggle');
const menuBtn = document.getElementById('menu-btn');
const navLinks = document.getElementById('nav-links');
const navbar = document.getElementById('navbar');
const skillBars = document.querySelectorAll('.skill-per');
const projectCards = document.querySelectorAll('.project-card');
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');
const modal = document.getElementById('galleryModal');
const modalImg = document.getElementById('modalImg');
const modalCaption = document.getElementById('modalCaption');
const closeModal = document.querySelector('.close-modal');
const contactForm = document.getElementById('contact-form');
const sections = document.querySelectorAll('section');
const typingText = document.querySelector('.typing-text');

// Loading Screen
window.addEventListener('load', () => {
    const loading = document.querySelector('.loading');
    if (loading) {
        loading.classList.add('hidden');
        setTimeout(() => {
            loading.remove();
        }, 500);
    }
});

// Scroll Animations
const revealElements = document.querySelectorAll('.section-header, .about-content, .project-card, .gallery-3d-item, .contact-card');

const revealOnScroll = () => {
    revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100) {
            element.classList.add('reveal', 'active');
        }
    });
};

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar Scroll Effect (improved)
let lastScroll = 0;
const NAV_SCROLL_THRESHOLD = 30; // pixels — ignore tiny scrolls to prevent flicker

window.addEventListener('scroll', () => {
    if (!navbar) return; // safety

    // If mobile menu is open, don't hide/show the navbar
    if (navLinks && navLinks.classList.contains('active')) return;

    const currentScroll = window.pageYOffset;

    // At top of page: ensure navbar is visible and clear classes
    if (currentScroll <= 0) {
        navbar.classList.remove('scroll-up', 'scroll-down');
        lastScroll = 0;
        return;
    }

    // Ignore very small scroll movements to avoid rapid toggling
    if (Math.abs(currentScroll - lastScroll) <= NAV_SCROLL_THRESHOLD) return;

    if (currentScroll > lastScroll) {
        // Scrolling down — hide navbar
        navbar.classList.remove('scroll-up');
        navbar.classList.add('scroll-down');
    } else {
        // Scrolling up — show navbar
        navbar.classList.remove('scroll-down');
        navbar.classList.add('scroll-up');
    }

    lastScroll = currentScroll;
});

// Theme Toggle
themeToggle.addEventListener('change', () => {
    body.classList.toggle('dark-mode');
    body.classList.toggle('light-mode');
    
    // Save theme preference
    const theme = body.classList.contains('dark-mode') ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
});

// Load saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    body.classList.remove('light-mode', 'dark-mode');
    body.classList.add(`${savedTheme}-mode`);
    themeToggle.checked = savedTheme === 'dark';
}

// Mobile Menu Toggle
menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!menuBtn.contains(e.target) && !navLinks.contains(e.target)) {
        menuBtn.classList.remove('active');
        navLinks.classList.remove('active');
    }
});

// Initialize skill bars
skillBars.forEach(bar => {
    const percentage = bar.getAttribute('per');
    bar.style.setProperty('--per', percentage);
});

// Add loading screen to HTML
const loadingScreen = document.createElement('div');
loadingScreen.className = 'loading';
loadingScreen.innerHTML = '<div class="loading-spinner"></div>';
document.body.prepend(loadingScreen);

// Typing Effect Animation
function typeWriter(element, text, i = 0) {
    if (i === 0) {
        element.textContent = '';
    }
    
    if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(() => typeWriter(element, text, i), 100);
    }
}

// Start typing animation after page loads
window.addEventListener('load', () => {
    const originalText = typingText.textContent;
    typeWriter(typingText, originalText);
});

// Particle Animation for Hero Background
function createParticles() {
    const particles = document.getElementById('particles');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('span');
        const size = Math.random() * 5 + 1;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        particle.style.opacity = Math.random() * 0.5 + 0.1;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;
        
        particles.appendChild(particle);
    }
}

createParticles();

// Add CSS for particles
function addParticleStyles() {
    const style = document.createElement('style');
    style.textContent = `
        #particles span {
            position: absolute;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            pointer-events: none;
            animation: float infinite linear;
        }
        
        @keyframes float {
            0% {
                transform: translateY(0) rotate(0deg);
            }
            25% {
                transform: translateY(-20px) rotate(90deg);
            }
            50% {
                transform: translateY(0) rotate(180deg);
            }
            75% {
                transform: translateY(20px) rotate(270deg);
            }
            100% {
                transform: translateY(0) rotate(360deg);
            }
        }
    `;
    document.head.appendChild(style);
}

addParticleStyles();

// Animate Skill Bars on Scroll
function animateSkillBars() {
    skillBars.forEach(skillBar => {
        const percentage = skillBar.getAttribute('per');
        skillBar.style.width = percentage;
    });
}

// Project Filtering
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(filterBtn => filterBtn.classList.remove('active'));
        
        // Add active class to clicked button
        btn.classList.add('active');
        
        const filterValue = btn.getAttribute('data-filter');
        
        projectCards.forEach(card => {
            if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// Gallery Modal
galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        const imgSrc = item.querySelector('.gallery-img').style.backgroundImage.match(/url\(['"]?(.*?)['"]?\)/)?.[1] || '/api/placeholder/800/600';
        const title = item.querySelector('h3').textContent;
        const desc = item.querySelector('p').textContent;
        
        modalImg.src = imgSrc;
        modalCaption.innerHTML = `<h3>${title}</h3><p>${desc}</p>`;
        modal.style.display = 'flex';
    });
});

// Close Modal
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Form Submission
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for your message! This form is just a demo and doesn\'t actually send emails.');
        contactForm.reset();
    });
}

// Scroll Animation
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};

const appearOnScroll = new IntersectionObserver((entries, appearOnScroll) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        
        entry.target.classList.add('active');
        
        if (entry.target.id === 'about') {
            setTimeout(animateSkillBars, 500);
        }
        
        appearOnScroll.unobserve(entry.target);
    });
}, observerOptions);

sections.forEach(section => {
    appearOnScroll.observe(section);
    section.classList.add('fade-in');
});

// Add CSS for fade-in animations
function addScrollAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .fade-in {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 1s ease, transform 1s ease;
        }
        
        .fade-in.active {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
}

addScrollAnimationStyles();

// Dynamic Year in Footer
const yearSpan = document.querySelector('.footer-bottom p');
if (yearSpan) {
    const currentYear = new Date().getFullYear();
    yearSpan.textContent = yearSpan.textContent.replace('2025', currentYear);
}

// Ensure the 'Download CV' button downloads the file
const downloadCvButton = document.getElementById('download-cv');
if (downloadCvButton) {
    downloadCvButton.addEventListener('click', () => {
        const link = document.createElement('a');
        link.href = './cv/resume.pdf'; // Path to the resume file
        link.download = 'resume.pdf'; // File name for download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
}