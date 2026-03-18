/**
 * AppController — Client portfolio entry point.
 * Opens DB, seeds, boots section controllers, and wires all global UX.
 *
 * FEATURES:
 *  - Cursor glow effect
 *  - Typing animation (safe: does not corrupt innerHTML with nested tags)
 *  - Hero stat counters (animated)
 *  - About tab switching (About / Experience / Skills)
 *  - Skill bar animation triggered on Skills tab open
 *  - Footer social links from profile DB
 *  - Scroll reveal with stagger delays on cards
 *  - Navbar hide/show + active link update
 *  - Theme toggle (persisted)
 *  - Particles
 *  - CV download
 */
import { Database }           from '../../core/db.js';
import { seedDatabase }        from '../../core/seed.js';
import { Profile }             from '../../core/models/Profile.js';
import { Skill }               from '../../core/models/Skill.js';
import { HeroView }            from '../views/HeroView.js';
import { AboutView }           from '../views/AboutView.js';
import { ProjectsController }  from './ProjectsController.js';
import { GalleryController }   from './GalleryController.js';
import { ContactController }   from './ContactController.js';
import { escapeHTML }          from '../../core/utils.js';

class AppController {
    #db;
    #heroView;
    #aboutView;

    constructor() {
        this.#db        = Database.getInstance();
        this.#heroView  = new HeroView();
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
        this.#initCursorGlow();
        this.#initStatCounters();
    }

    // ── Hero ──────────────────────────────────────────────────────────────────

    async #initHero() {
        const raw = await this.#db.get('profile', 'main');
        if (raw) this.#heroView.render(Profile.fromPlainObject(raw));

        // CV download
        const cvBtn = document.getElementById('download-cv');
        if (cvBtn) {
            cvBtn.addEventListener('click', () => {
                const profileObj = raw ? Profile.fromPlainObject(raw) : new Profile();
                
                // Prioritize uploaded CV File (Base64), fallback to external URL, then fallback to hardcoded href
                const cvHref = profileObj.cvFile || profileObj.cvUrl || cvBtn.dataset.href;
                
                if (!cvHref || cvHref === 'undefined') {
                    this.#showToast('No CV file configured yet.', 'error');
                    return;
                }
                
                const link = document.createElement('a');
                link.href = cvHref;
                link.download = profileObj.cvFileName || 'Charuka_Mayura_CV.pdf';
                link.click();
            });
        }

        // Typing animation — plain text only (no HTML corruption)
        const nameEl = document.getElementById('hero-name');
        if (nameEl) {
            const prefix   = "Hi, I'm ";
            const nameText = nameEl.querySelector('.highlight-text')?.textContent || '';
            nameEl.innerHTML = '';
            let i = 0;
            const full = prefix + nameText;
            const type = () => {
                if (i < full.length) {
                    const chunk = full.slice(0, ++i);
                    if (chunk.length <= prefix.length) {
                        nameEl.textContent = chunk;
                    } else {
                        nameEl.innerHTML =
                            escapeHTML(prefix) +
                            `<span class="highlight-text">${escapeHTML(chunk.slice(prefix.length))}</span>`;
                    }
                    setTimeout(type, 22);
                }
            };
            setTimeout(type, 400);
        }
    }

    // ── About ─────────────────────────────────────────────────────────────────

    async #initAbout() {
        const [rawProfile, rawSkills] = await Promise.all([
            this.#db.get('profile', 'main'),
            this.#db.getAll('skills'),
        ]);
        const profile = rawProfile ? Profile.fromPlainObject(rawProfile) : null;
        const skills  = rawSkills.map(s => Skill.fromPlainObject(s));
        if (profile) this.#aboutView.render(profile, skills);
    }


    // ── Animated stat counters ────────────────────────────────────────────────

    #initStatCounters() {
        const counters = document.querySelectorAll('.stat-n[data-target]');
        if (!counters.length) return;

        const animate = (el) => {
            const target = parseInt(el.dataset.target, 10);
            const dur    = 1600;
            const start  = performance.now();
            const step   = (now) => {
                const t   = Math.min((now - start) / dur, 1);
                const ease = 1 - Math.pow(1 - t, 4);    // ease-out-quart
                el.textContent = Math.round(ease * target);
                if (t < 1) requestAnimationFrame(step);
                else el.textContent = target;
            };
            requestAnimationFrame(step);
        };

        const obs = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    counters.forEach(animate);
                    obs.disconnect();
                }
            });
        }, { threshold: 0.5 });

        const statsEl = document.querySelector('.hero-stats');
        if (statsEl) obs.observe(statsEl);
    }

    // ── Cursor glow ───────────────────────────────────────────────────────────

    #initCursorGlow() {
        const glow = document.getElementById('cursor-glow');
        if (!glow) return;
        if (window.matchMedia('(pointer: coarse)').matches) {
            glow.style.display = 'none';
            return;
        }
        document.addEventListener('mousemove', (e) => {
            glow.style.left = `${e.clientX}px`;
            glow.style.top  = `${e.clientY}px`;
        });
    }

    // ── Navbar ────────────────────────────────────────────────────────────────

    #initNav() {
        const menuBtn  = document.getElementById('menu-btn');
        const navLinks = document.getElementById('nav-links');
        const navbar   = document.getElementById('navbar');

        // Mobile menu toggle
        menuBtn?.addEventListener('click', () => {
            menuBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });

        // Close mobile menu on nav-link click
        navLinks?.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                menuBtn?.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!menuBtn?.contains(e.target) && !navLinks?.contains(e.target)) {
                menuBtn?.classList.remove('active');
                navLinks?.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Scroll: hide/show navbar + scrolled class
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const cur = window.pageYOffset;
            navbar?.classList.toggle('scrolled', cur > 20);
            if (cur <= 0) {
                navbar?.classList.remove('scroll-down', 'scroll-up');
                lastScroll = 0;
                return;
            }
            if (navLinks?.classList.contains('active')) return;
            if (Math.abs(cur - lastScroll) < 40) return;
            navbar?.classList.toggle('scroll-down', cur > lastScroll);
            navbar?.classList.toggle('scroll-up',   cur < lastScroll);
            lastScroll = cur;
        }, { passive: true });

        // Active link highlighting
        const sections = document.querySelectorAll('section[id]');
        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(sec => {
                if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
            });
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
            });
        }, { passive: true });
    }

    // ── Theme toggle ──────────────────────────────────────────────────────────

    #initTheme() {
        const toggle = document.getElementById('theme-toggle');
        const body   = document.body;
        const saved  = localStorage.getItem('theme') || 'dark';

        body.className = `${saved}-mode`;
        if (toggle) toggle.checked = (saved === 'dark');

        toggle?.addEventListener('change', () => {
            const isDark = toggle.checked;
            body.className = isDark ? 'dark-mode' : 'light-mode';
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }

    // ── Particles ─────────────────────────────────────────────────────────────

    #initParticles() {
        const container = document.getElementById('particles');
        if (!container) return;
        // Reduce count on mobile
        const count = window.innerWidth < 640 ? 25 : 50;
        for (let i = 0; i < count; i++) {
            const p    = document.createElement('span');
            const size = Math.random() * 4 + 1.5;
            p.style.cssText = `
                width:${size}px; height:${size}px;
                left:${Math.random() * 100}%;
                top:${Math.random() * 100 + 100}%;
                opacity:${Math.random() * 0.4 + 0.05};
                animation-duration:${Math.random() * 18 + 12}s;
                animation-delay:${Math.random() * 8}s;
            `;
            container.appendChild(p);
        }
    }

    // ── Scroll Reveal ─────────────────────────────────────────────────────────

    #initScrollReveal() {
        this.#reObserveReveals();
        // Re-check after dynamic content loads
        setTimeout(() => this.#reObserveReveals(), 600);
        setTimeout(() => this.#reObserveReveals(), 1400);
    }

    #reObserveReveals() {
        const obs = new IntersectionObserver((entries) => {
            entries.forEach((e, idx) => {
                if (e.isIntersecting) {
                    // Stagger delay for grid children
                    const delay = e.target.dataset.delay || (idx * 60);
                    setTimeout(() => e.target.classList.add('active'), Number(delay));
                    obs.unobserve(e.target);
                }
            });
        }, { threshold: 0.08 });

        document.querySelectorAll('.reveal:not(.active), .reveal-left:not(.active), .reveal-right:not(.active)')
            .forEach(el => obs.observe(el));
    }

    // ── Footer ────────────────────────────────────────────────────────────────

    async #initFooter() {
        // Year
        const y = document.getElementById('footer-year');
        if (y) y.textContent = new Date().getFullYear();

        // Tagline from profile
        const raw = await this.#db.get('profile', 'main');
        if (raw) {
            const profile = Profile.fromPlainObject(raw);
            const tagEl   = document.getElementById('footer-tagline');
            if (tagEl && profile.tagline) tagEl.textContent = profile.tagline;

            // Footer social links
            document.querySelectorAll('[data-social]').forEach(el => {
                const key = el.dataset.social;
                if (profile.socials[key]) el.href = profile.socials[key];
            });
        }
    }

    // ── Shared Toast ──────────────────────────────────────────────────────────

    #showToast(msg, type = 'success') {
        const toast = document.getElementById('toast');
        if (!toast) return;
        toast.className = `toast-${type} show`;
        toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i> ${escapeHTML(msg)}`;
        clearTimeout(this._toastTimer);
        this._toastTimer = setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => { toast.className = ''; toast.innerHTML = ''; }, 400);
        }, 3500);
    }
}

// Boot
const app = new AppController();
window.addEventListener('DOMContentLoaded', () => app.init().catch(console.error));
