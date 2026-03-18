/**
 * AppController — Client portfolio entry point.
 * Opens DB, seeds on first run, boots all section controllers.
 */
import { Database } from '../../core/db.js';
import { seedDatabase } from '../../core/seed.js';
import { Profile } from '../../core/models/Profile.js';
import { Skill } from '../../core/models/Skill.js';
import { HeroView } from '../views/HeroView.js';
import { AboutView } from '../views/AboutView.js';
import { ProjectsController } from './ProjectsController.js';
import { GalleryController } from './GalleryController.js';
import { ContactController } from './ContactController.js';

class AppController {
    #db;
    #heroView;
    #aboutView;

    constructor() {
        this.#db = Database.getInstance();
        this.#heroView = new HeroView();
        this.#aboutView = new AboutView();
    }

    async init() {
        await this.#db.open();
        await seedDatabase();
        await this.#initHero();
        await this.#initAbout();
        await new ProjectsController().init();
        await new GalleryController().init();
        await new ContactController().init();
        this.#initNav();
        this.#initTheme();
        this.#initParticles();
        this.#initScrollReveal();
        this.#initFooter();
    }

    async #initHero() {
        const raw = await this.#db.get('profile', 'main');
        if (raw) this.#heroView.render(Profile.fromPlainObject(raw));

        // CV download
        const cvBtn = document.getElementById('download-cv');
        if (cvBtn) cvBtn.addEventListener('click', () => {
            const link = document.createElement('a');
            link.href = cvBtn.dataset.href || '../cv/resume.pdf';
            link.download = 'resume.pdf';
            link.click();
        });

        // Typing animation
        const typingEl = document.getElementById('hero-name');
        if (typingEl) {
            const full = typingEl.innerHTML;
            typingEl.innerHTML = '';
            let i = 0;
            const type = () => {
                if (i < full.length) {
                    typingEl.innerHTML = full.slice(0, ++i);
                    setTimeout(type, 18);
                }
            };
            setTimeout(type, 300);
        }
    }

    async #initAbout() {
        const [rawProfile, rawSkills] = await Promise.all([
            this.#db.get('profile', 'main'),
            this.#db.getAll('skills'),
        ]);
        const profile = rawProfile ? Profile.fromPlainObject(rawProfile) : null;
        const skills  = rawSkills.map(s => Skill.fromPlainObject(s));
        if (profile) this.#aboutView.render(profile, skills);

        // Animate bars when section enters viewport
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
            new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.#aboutView.animateSkillBars();
                        obs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2 }).observe(aboutSection);
        }
    }

    #initNav() {
        const menuBtn = document.getElementById('menu-btn');
        const navLinks = document.getElementById('nav-links');
        const navbar = document.getElementById('navbar');

        menuBtn?.addEventListener('click', () => {
            menuBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        document.addEventListener('click', (e) => {
            if (!menuBtn?.contains(e.target) && !navLinks?.contains(e.target)) {
                menuBtn?.classList.remove('active');
                navLinks?.classList.remove('active');
            }
        });

        // Scroll-hide / show navbar
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const cur = window.pageYOffset;
            if (cur <= 0) { navbar?.classList.remove('scroll-down', 'scroll-up'); lastScroll = 0; return; }
            if (navLinks?.classList.contains('active')) return;
            if (Math.abs(cur - lastScroll) < 30) return;
            navbar?.classList.toggle('scroll-down', cur > lastScroll);
            navbar?.classList.toggle('scroll-up', cur < lastScroll);
            lastScroll = cur;
        });

        // Active link highlighting
        const sections = document.querySelectorAll('section[id]');
        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(sec => {
                if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
            });
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
            });
        });
    }

    #initTheme() {
        const toggle = document.getElementById('theme-toggle');
        const body = document.body;
        const saved = localStorage.getItem('theme') || 'dark';

        body.className = `${saved}-mode`;
        if (toggle) toggle.checked = saved === 'dark';

        toggle?.addEventListener('change', () => {
            const isDark = toggle.checked;
            body.className = isDark ? 'dark-mode' : 'light-mode';
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }

    #initParticles() {
        const container = document.getElementById('particles');
        if (!container) return;
        for (let i = 0; i < 55; i++) {
            const p = document.createElement('span');
            const size = Math.random() * 6 + 2;
            p.style.cssText = `
                width:${size}px; height:${size}px;
                left:${Math.random()*100}%; top:${Math.random()*100}%;
                opacity:${Math.random()*0.5+0.1};
                animation-duration:${Math.random()*20+10}s;
                animation-delay:${Math.random()*5}s;
            `;
            container.appendChild(p);
        }
    }

    #initScrollReveal() {
        const items = document.querySelectorAll('.reveal');
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) { e.target.classList.add('active'); obs.unobserve(e.target); }
            });
        }, { threshold: 0.1 });
        items.forEach(el => obs.observe(el));

        // Re-run after dynamic content loads (slight delay)
        setTimeout(() => {
            document.querySelectorAll('.reveal:not(.active)').forEach(el => obs.observe(el));
        }, 500);
    }

    #initFooter() {
        const y = document.getElementById('footer-year');
        if (y) y.textContent = new Date().getFullYear();
    }
}

// Boot
const app = new AppController();
window.addEventListener('DOMContentLoaded', () => app.init().catch(console.error));
