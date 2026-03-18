/**
 * ProjectsController — Loads projects from DB, triggers view rendering, handles filter.
 */
import { Database } from '../../core/db.js';
import { Project } from '../../core/models/Project.js';
import { ProjectsView } from '../views/ProjectsView.js';

export class ProjectsController {
    #db;
    #view;

    constructor() {
        this.#db = Database.getInstance();
        this.#view = new ProjectsView();
    }

    async init() {
        const raw = await this.#db.getAll('projects');
        const projects = raw.map(r => Project.fromPlainObject(r));
        this.#view.render(projects);
        this.#bindFilters();
    }

    #bindFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.#view.filterCards(btn.dataset.filter);
            });
        });
    }
}
