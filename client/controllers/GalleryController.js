/**
 * GalleryController — Loads gallery items from DB, renders grid, handles lightbox.
 */
import { Database } from '../../core/db.js';
import { GalleryItem } from '../../core/models/GalleryItem.js';
import { GalleryView } from '../views/GalleryView.js';

export class GalleryController {
    #db;
    #view;

    constructor() {
        this.#db = Database.getInstance();
        this.#view = new GalleryView();
    }

    async init() {
        const raw = await this.#db.getAll('gallery');
        const items = raw.map(r => GalleryItem.fromPlainObject(r));
        this.#view.render(items);
        this.#bindLightbox();
    }

    #bindLightbox() {
        const grid = document.getElementById('gallery-grid');
        if (!grid) return;

        grid.addEventListener('click', (e) => {
            const item = e.target.closest('.gallery-item');
            if (!item) return;
            this.#view.openModal(item.dataset.src, item.dataset.title, item.dataset.desc);
        });

        // Close on overlay click or close button
        const modal = document.getElementById('gallery-modal');
        const closeBtn = document.getElementById('modal-close');
        if (closeBtn) closeBtn.addEventListener('click', () => this.#view.closeModal());
        if (modal) modal.addEventListener('click', (e) => {
            if (e.target === modal) this.#view.closeModal();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.#view.closeModal();
        });
    }
}
