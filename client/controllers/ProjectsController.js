/**
 * ProjectsController — Loads projects from DB, renders cards, handles filter.
 */
import { Database }      from '../../core/db.js';
import { Project }       from '../../core/models/Project.js';
import { ProjectsView }  from '../views/ProjectsView.js';

export class ProjectsController {
    #db;
    #view;

    constructor() {
        this.#db   = Database.getInstance();
        this.#view = new ProjectsView();
    }

    async init() {
        const raw      = await this.#db.getAll('projects');
        const projects = raw.map(r => Project.fromPlainObject(r));
        this.#view.render(projects);
        this.#bindFilters();
        this.#staggerRevealCards();
    }

    #bindFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.#view.filterCards(btn.dataset.filter);

                // Re-animate newly visible cards
                this.#staggerRevealCards();
            });
        });
    }

    /** Add staggered reveal to project cards so they animate in sequence */
    #staggerRevealCards() {
        document.querySelectorAll('.project-card:not(.hidden)').forEach((card, i) => {
            card.style.animationDelay = `${i * 60}ms`;
            card.classList.remove('active');
            // Trigger reflow then add active
            void card.offsetWidth;
            setTimeout(() => card.classList.add('active'), i * 60);
        });
    }
}
