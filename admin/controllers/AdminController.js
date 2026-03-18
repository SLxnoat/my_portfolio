/**
 * AdminController — Root dashboard controller.
 * Guards auth, wires sidebar navigation, loads all sub-controllers.
 */
import { Database } from '../../core/db.js';
import { ProfileController } from './ProfileController.js';
import { ProjectsAdminController } from './ProjectsAdminController.js';
import { GalleryAdminController } from './GalleryAdminController.js';
import { MessagesController } from './MessagesController.js';
import { SkillsAdminController } from './SkillsAdminController.js';
import { SettingsController } from './SettingsController.js';

// ── Lightweight modal helper (shared across controllers) ──────────────────────
class Modal {
    open(title, bodyHtml) {
        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-body').innerHTML = bodyHtml;
        document.getElementById('admin-modal').classList.add('active');
    }
    close() {
        document.getElementById('admin-modal').classList.remove('active');
    }
}

// ── Root AdminController ──────────────────────────────────────────────────────
class AdminController {
    #db;
    #modal;
    #activePanel = 'dashboard';

    // controller singletons per panel (lazy-inited)
    #controllers = {};

    constructor() {
        this.#db = Database.getInstance();
        this.#modal = new Modal();
    }

    async init() {
        // Auth guard
        if (!sessionStorage.getItem('admin_auth')) {
            window.location.replace('login.html');
            return;
        }

        await this.#db.open();
        this.#bindSidebar();
        this.#bindLogout();
        this.#bindModal();
        this.#bindSidebarToggle();
        await this.#loadPanel('dashboard');
    }

    #bindSidebar() {
        document.querySelectorAll('[data-panel]').forEach(el => {
            el.addEventListener('click', async (e) => {
                e.preventDefault();
                const panel = el.dataset.panel;
                if (panel) await this.#loadPanel(panel);
            });
        });
        // Also close sidebar on mobile after click
        document.querySelectorAll('.sidebar .nav-item').forEach(el => {
            el.addEventListener('click', () => {
                if (window.innerWidth < 900) document.getElementById('sidebar').classList.remove('open');
            });
        });
    }

    async #loadPanel(panelId) {
        // Deactivate previous
        document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

        const panel = document.getElementById(`panel-${panelId}`);
        if (panel) panel.classList.add('active');

        document.querySelector(`[data-panel="${panelId}"]`)?.classList.add('active');
        document.getElementById('topbar-title').textContent =
            panelId.charAt(0).toUpperCase() + panelId.slice(1);
        this.#activePanel = panelId;

        // Load controller lazily
        switch (panelId) {
            case 'dashboard':
                await this.#loadDashboard(); break;
            case 'profile':
                await this.#getCtrl('profile', () => new ProfileController())
                    .render(document.getElementById('profile-form-wrap')); break;
            case 'projects':
                await this.#getCtrl('projects', () => new ProjectsAdminController(this.#modal))
                    .render(document.getElementById('projects-list')); break;
            case 'gallery':
                await this.#getCtrl('gallery', () => new GalleryAdminController(this.#modal))
                    .render(document.getElementById('gallery-list')); break;
            case 'messages':
                await this.#getCtrl('messages', () => new MessagesController())
                    .render(document.getElementById('messages-list')); break;
            case 'skills':
                await this.#getCtrl('skills', () => new SkillsAdminController(this.#modal))
                    .render(document.getElementById('skills-list')); break;
            case 'settings':
                await this.#getCtrl('settings', () => new SettingsController())
                    .render(document.getElementById('settings-form-wrap')); break;
        }
    }

    #getCtrl(key, factory) {
        // Always create fresh controller on panel switch so data is never stale after CRUD ops
        this.#controllers[key] = factory();
        return this.#controllers[key];
    }

    async #loadDashboard() {
        const [projects, gallery, messages, skills] = await Promise.all([
            this.#db.count('projects'),
            this.#db.count('gallery'),
            this.#db.getAll('messages'),
            this.#db.count('skills'),
        ]);
        const unread = messages.filter(m => !m.read).length;

        const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
        set('stat-projects', projects);
        set('stat-gallery', gallery);
        set('stat-messages', messages.length);
        set('stat-unread', unread);

        // Unread badge
        const badge = document.getElementById('unread-badge');
        if (badge) { badge.textContent = unread; badge.style.display = unread ? 'inline-flex' : 'none'; }
    }

    #bindLogout() {
        document.getElementById('logout-btn')?.addEventListener('click', () => {
            sessionStorage.removeItem('admin_auth');
            sessionStorage.removeItem('admin_user');
            window.location.replace('login.html');
        });
    }

    #bindModal() {
        document.getElementById('modal-close')?.addEventListener('click', () => this.#modal.close());
        document.getElementById('modal-overlay')?.addEventListener('click', () => this.#modal.close());
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') this.#modal.close(); });
    }

    #bindSidebarToggle() {
        document.getElementById('sidebar-toggle')?.addEventListener('click', () => {
            document.getElementById('sidebar').classList.toggle('open');
        });
    }
}

// Boot
const admin = new AdminController();
window.addEventListener('DOMContentLoaded', () => admin.init().catch(console.error));
