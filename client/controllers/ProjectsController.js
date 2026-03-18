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
            card.style.transition = 'none';
            card.classList.remove('active');
            card.style.transform = 'scale(0.95) translateY(20px)';
            card.style.opacity = '0';
            
            // Trigger reflow
            void card.offsetWidth;
            
            setTimeout(() => {
                card.style.transition = 'transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.15), opacity 0.6s ease';
                card.classList.add('active');
                card.style.transform = 'none';
                card.style.opacity = '1';
                
                // Cleanup inline styles to allow CSS hover states
                setTimeout(() => {
                    // Only cleanup if the card is still active to avoid glitching during rapid filter changes
                    if (card.classList.contains('active')) {
                         card.style.transition = '';
                         card.style.transform = '';
                         card.style.opacity = '';
                    }
                }, 600);
            }, i * 80);
        });
    }
}
