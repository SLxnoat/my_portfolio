/**
 * ProjectsAdminController — Full CRUD for portfolio projects.
 */
import { Database } from '../../core/db.js';
import { Project } from '../../core/models/Project.js';

export class ProjectsAdminController {
    #db;
    #modal;

    constructor(modal) {
        this.#db = Database.getInstance();
        this.#modal = modal;
    }

    async render(container) {
        const items = await this.#db.getAll('projects');
        this.#renderList(container, items.map(r => Project.fromPlainObject(r)));
        document.getElementById('add-project-btn')?.addEventListener('click', () => {
            this.#openForm(container);
        });
    }

    #renderList(container, projects) {
        if (!projects.length) {
            container.innerHTML = '<p class="empty-state"><i class="fas fa-folder-open"></i> No projects yet. Add your first one!</p>';
            return;
        }
        container.innerHTML = `
        <div class="data-grid">
            ${projects.map(p => `
            <div class="data-card" data-id="${p.id}">
                <div class="data-card-icon"><i class="${p.icon}"></i></div>
                <div class="data-card-body">
                    <h4>${p.title}</h4>
                    <p>${p.description}</p>
                    <div class="tag-row">${p.tech.map(t=>`<span class="tag">${t}</span>`).join('')}</div>
                    <span class="category-badge">${p.category}</span>
                </div>
                <div class="data-card-actions">
                    <button class="icon-btn edit-btn" data-id="${p.id}" title="Edit"><i class="fas fa-pen"></i></button>
                    <button class="icon-btn delete-btn danger" data-id="${p.id}" title="Delete"><i class="fas fa-trash"></i></button>
                </div>
            </div>`).join('')}
        </div>`;

        container.querySelectorAll('.edit-btn').forEach(btn =>
            btn.addEventListener('click', async () => {
                const raw = await this.#db.get('projects', Number(btn.dataset.id));
                this.#openForm(container, Project.fromPlainObject(raw));
            })
        );
        container.querySelectorAll('.delete-btn').forEach(btn =>
            btn.addEventListener('click', async () => {
                if (!confirm('Delete this project?')) return;
                await this.#db.delete('projects', Number(btn.dataset.id));
                await this.render(container);
            })
        );
    }

    #openForm(container, project = null) {
        const p = project || new Project({});
        const isEdit = !!project;
        const highlightsStr = (p.highlights || []).join('\n');

        this.#modal.open(`${isEdit ? 'Edit' : 'Add'} Project`, `
        <form id="project-form" class="admin-form">
            <div class="form-group"><label>Title</label><input name="title" value="${p.title}" required></div>
            <div class="form-group"><label>Description</label><textarea name="description" rows="3">${p.description}</textarea></div>
            <div class="form-group">
                <label>Category</label>
                <select name="category">
                    ${['ai-ml','web','app','design','gaming'].map(c=>`<option value="${c}" ${p.category===c?'selected':''}>${c}</option>`).join('')}
                </select>
            </div>
            <div class="form-group"><label>Tech (comma-separated)</label><input name="tech" value="${p.tech.join(', ')}"></div>
            <div class="form-group"><label>Icon Class (Font Awesome)</label><input name="icon" value="${p.icon}" placeholder="fas fa-code"></div>
            <div class="form-group">
                <label>Key Highlights (one per line)</label>
                <textarea name="highlights" rows="4" placeholder="96% accuracy on test set&#10;Deployed to production&#10;Used by 500+ users">${highlightsStr}</textarea>
            </div>
            <div class="form-group">
                <label>Project Image URL or Path</label>
                <input name="imageSrc" id="img-src-input" value="${p.imageSrc}" placeholder="https://... or ../img/project.jpg">
            </div>
            <div class="form-group">
                <label>— OR — Upload Image</label>
                <input type="file" id="img-upload" accept="image/*">
                ${p.imageSrc ? `<div style="margin-top:10px;height:120px;border-radius:8px;background:url('${p.imageSrc}') center/cover;border:1px solid var(--border)"></div>` : ''}
            </div>
            <div class="form-group"><label>Demo URL</label><input name="demo" value="${p.links.demo}"></div>
            <div class="form-group"><label>GitHub URL</label><input name="github" value="${p.links.github}"></div>
            <div class="form-group"><label>Gallery URL</label><input name="gallery" value="${p.links.gallery}"></div>
            <div class="form-group"><label>YouTube URL</label><input name="youtube" value="${p.links.youtube}"></div>
            <div class="form-actions">
                <button type="button" class="btn secondary-btn" id="cancel-modal">Cancel</button>
                <button type="submit" class="btn primary-btn"><i class="fas fa-save"></i> ${isEdit ? 'Update' : 'Add'}</button>
            </div>
        </form>`);

        document.getElementById('cancel-modal')?.addEventListener('click', () => this.#modal.close());

        // Image upload → base64 fills the URL input
        document.getElementById('img-upload')?.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                document.getElementById('img-src-input').value = ev.target.result;
            };
            reader.readAsDataURL(file);
        });

        document.getElementById('project-form')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const fd = new FormData(e.target);
            const data = Object.fromEntries(fd.entries());
            const updated = new Project({
                ...(isEdit ? { id: p.id } : {}),
                title: data.title, description: data.description,
                category: data.category, icon: data.icon,
                imageSrc: data.imageSrc || '',
                highlights: (data.highlights || '').split('\n').map(s => s.trim()).filter(Boolean),
                tech: data.tech.split(',').map(s => s.trim()).filter(Boolean),
                links: { demo: data.demo, github: data.github, gallery: data.gallery, youtube: data.youtube },
            });
            await this.#db.put('projects', updated.toPlainObject());
            this.#modal.close();
            await this.render(container);
        });
    }
}
