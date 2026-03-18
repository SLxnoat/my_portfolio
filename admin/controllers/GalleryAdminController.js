/**
 * GalleryAdminController — Full CRUD for gallery items.
 * Supports base64 image upload.
 */
import { Database } from '../../core/db.js';
import { GalleryItem } from '../../core/models/GalleryItem.js';

export class GalleryAdminController {
    #db;
    #modal;

    constructor(modal) {
        this.#db = Database.getInstance();
        this.#modal = modal;
    }

    async render(container) {
        const items = await this.#db.getAll('gallery');
        this.#renderList(container, items.map(r => GalleryItem.fromPlainObject(r)));
        document.getElementById('add-gallery-btn')?.addEventListener('click', () => {
            this.#openForm(container);
        });
    }

    #renderList(container, items) {
        if (!items.length) {
            container.innerHTML = '<p class="empty-state"><i class="fas fa-images"></i> No gallery items yet.</p>';
            return;
        }
        container.innerHTML = `
        <div class="gallery-admin-grid">
            ${items.map(item => `
            <div class="gallery-admin-card" data-id="${item.id}">
                <div class="gallery-thumb" style="background-image:url('${item.imageSrc}')"></div>
                <div class="gallery-card-info">
                    <h4>${item.title}</h4>
                    <span class="category-badge">${item.category}</span>
                </div>
                <div class="data-card-actions">
                    <button class="icon-btn edit-btn" data-id="${item.id}" title="Edit"><i class="fas fa-pen"></i></button>
                    <button class="icon-btn delete-btn danger" data-id="${item.id}" title="Delete"><i class="fas fa-trash"></i></button>
                </div>
            </div>`).join('')}
        </div>`;

        container.querySelectorAll('.edit-btn').forEach(btn =>
            btn.addEventListener('click', async () => {
                const raw = await this.#db.get('gallery', Number(btn.dataset.id));
                this.#openForm(container, GalleryItem.fromPlainObject(raw));
            })
        );
        container.querySelectorAll('.delete-btn').forEach(btn =>
            btn.addEventListener('click', async () => {
                if (!confirm('Delete this gallery item?')) return;
                await this.#db.delete('gallery', Number(btn.dataset.id));
                await this.render(container);
            })
        );
    }

    #openForm(container, item = null) {
        const g = item || new GalleryItem({});
        const isEdit = !!item;

        this.#modal.open(`${isEdit ? 'Edit' : 'Add'} Gallery Item`, `
        <form id="gallery-form" class="admin-form">
            <div class="form-group"><label>Title</label><input name="title" value="${g.title}" required></div>
            <div class="form-group"><label>Description</label><textarea name="description" rows="3">${g.description}</textarea></div>
            <div class="form-group">
                <label>Category</label>
                <select name="category">
                    ${['design','branding','poster','digital-art','other'].map(c=>`<option value="${c}" ${g.category===c?'selected':''}>${c}</option>`).join('')}
                </select>
            </div>
            <div class="form-group">
                <label>Image Path (relative) or Upload</label>
                <input name="imageSrc" id="img-src-input" value="${g.imageSrc}" placeholder="../img/example.jpg">
            </div>
            <div class="form-group">
                <label>Or Upload Image</label>
                <input type="file" id="img-upload" accept="image/*">
                ${g.imageSrc ? `<div class="img-preview" style="background-image:url('${g.imageSrc}');margin-top:10px;height:120px;border-radius:8px;background-size:cover;background-position:center;"></div>` : ''}
            </div>
            <div class="form-actions">
                <button type="button" class="btn secondary-btn" id="cancel-modal">Cancel</button>
                <button type="submit" class="btn primary-btn"><i class="fas fa-save"></i> ${isEdit ? 'Update' : 'Add'}</button>
            </div>
        </form>`);

        // Image upload → base64
        document.getElementById('img-upload')?.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                document.getElementById('img-src-input').value = ev.target.result;
            };
            reader.readAsDataURL(file);
        });

        document.getElementById('cancel-modal')?.addEventListener('click', () => this.#modal.close());
        document.getElementById('gallery-form')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const fd = new FormData(e.target);
            const data = Object.fromEntries(fd.entries());
            const updated = new GalleryItem({
                ...(isEdit ? { id: g.id } : {}),
                title: data.title, description: data.description,
                category: data.category, imageSrc: data.imageSrc,
            });
            await this.#db.put('gallery', updated.toPlainObject());
            this.#modal.close();
            await this.render(container);
        });
    }
}
