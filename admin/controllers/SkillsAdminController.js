/**
 * SkillsAdminController — CRUD for skills.
 */
import { Database } from '../../core/db.js';
import { Skill } from '../../core/models/Skill.js';

export class SkillsAdminController {
    #db;
    #modal;

    constructor(modal) {
        this.#db = Database.getInstance();
        this.#modal = modal;
    }

    async render(container) {
        const items = await this.#db.getAll('skills');
        this.#renderList(container, items.map(r => Skill.fromPlainObject(r)));
        document.getElementById('add-skill-btn')?.addEventListener('click', () => {
            this.#openForm(container);
        });
    }

    #renderList(container, skills) {
        if (!skills.length) {
            container.innerHTML = '<p class="empty-state"><i class="fas fa-star"></i> No skills added yet.</p>';
            return;
        }
        container.innerHTML = `
        <div class="data-grid">
            ${skills.map(s => `
            <div class="data-card" data-id="${s.id}">
                <div class="data-card-icon" style="background:linear-gradient(135deg,#7c3aed,#06b6d4)"><i class="${s.icon || 'fas fa-star'}"></i></div>
                <div class="data-card-body">
                    <h4>${s.name}</h4>
                    <div class="skill-bar-admin">
                        <div class="skill-fill-admin" style="width:${s.percentage}%"></div>
                    </div>
                    <span style="font-size:.8rem;color:#94a3b8">${s.percentage}%</span>
                </div>
                <div class="data-card-actions">
                    <button class="icon-btn edit-btn" data-id="${s.id}" title="Edit"><i class="fas fa-pen"></i></button>
                    <button class="icon-btn delete-btn danger" data-id="${s.id}" title="Delete"><i class="fas fa-trash"></i></button>
                </div>
            </div>`).join('')}
        </div>`;

        container.querySelectorAll('.edit-btn').forEach(btn =>
            btn.addEventListener('click', async () => {
                const raw = await this.#db.get('skills', Number(btn.dataset.id));
                this.#openForm(container, Skill.fromPlainObject(raw));
            })
        );
        container.querySelectorAll('.delete-btn').forEach(btn =>
            btn.addEventListener('click', async () => {
                if (!confirm('Delete this skill?')) return;
                await this.#db.delete('skills', Number(btn.dataset.id));
                await this.render(container);
            })
        );
    }

    #openForm(container, skill = null) {
        const s = skill || new Skill({});
        const isEdit = !!skill;

        this.#modal.open(`${isEdit ? 'Edit' : 'Add'} Skill`, `
        <form id="skill-form" class="admin-form">
            <div class="form-group"><label>Skill Name</label><input name="name" value="${s.name}" required></div>
            <div class="form-group"><label>Percentage (0-100)</label><input name="percentage" type="number" min="0" max="100" value="${s.percentage}" required></div>
            <div class="form-group"><label>Icon Class (Font Awesome)</label><input name="icon" value="${s.icon}" placeholder="fas fa-code"></div>
            <div class="form-actions">
                <button type="button" class="btn secondary-btn" id="cancel-modal">Cancel</button>
                <button type="submit" class="btn primary-btn"><i class="fas fa-save"></i> ${isEdit ? 'Update' : 'Add'}</button>
            </div>
        </form>`);

        document.getElementById('cancel-modal')?.addEventListener('click', () => this.#modal.close());
        document.getElementById('skill-form')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const fd = new FormData(e.target);
            const data = Object.fromEntries(fd.entries());
            const updated = new Skill({
                ...(isEdit ? { id: s.id } : {}),
                name: data.name, percentage: Number(data.percentage), icon: data.icon,
            });
            await this.#db.put('skills', updated.toPlainObject());
            this.#modal.close();
            await this.render(container);
        });
    }
}
