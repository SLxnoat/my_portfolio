/**
 * ProfileController — Load and save the portfolio Profile in admin.
 * Includes full avatar image CRUD: upload, URL, preview, remove.
 */
import { Database } from '../../core/db.js';
import { Profile } from '../../core/models/Profile.js';

export class ProfileController {
    #db;
    #currentAvatarSrc = '';

    constructor() {
        this.#db = Database.getInstance();
    }

    async render(container) {
        const raw = await this.#db.get('profile', 'main');
        const p = raw ? Profile.fromPlainObject(raw) : new Profile();
        this.#currentAvatarSrc = p.avatarSrc;

        container.innerHTML = `
        <form id="profile-form" class="admin-form">

            <!-- ── Avatar Card ── -->
            <div class="avatar-crud-card">
                <div class="avatar-preview-wrap">
                    <div class="avatar-preview" id="avatar-preview"
                         style="${p.avatarSrc ? `background-image:url('${p.avatarSrc}')` : ''}">
                        ${!p.avatarSrc ? '<i class="fas fa-user-circle"></i>' : ''}
                    </div>
                    <div class="avatar-info">
                        <h3>Profile Photo</h3>
                        <p>Upload a photo or paste an image URL. Accepts JPG, PNG, WebP.</p>
                        <div class="avatar-actions">
                            <label class="btn primary-btn avatar-upload-btn" for="avatar-upload">
                                <i class="fas fa-upload"></i> Upload Image
                            </label>
                            <input type="file" id="avatar-upload" accept="image/*" style="display:none">
                            <button type="button" class="btn secondary-btn" id="avatar-remove-btn">
                                <i class="fas fa-trash"></i> Remove
                            </button>
                        </div>
                        <div class="form-group" style="margin-top:14px">
                            <label>— OR — Image URL</label>
                            <input id="avatar-url-input" type="url" placeholder="https://..." value="${p.avatarSrc && !p.avatarSrc.startsWith('data:') ? p.avatarSrc : ''}">
                        </div>
                        <input type="hidden" name="avatarSrc" id="avatar-src-hidden" value="${p.avatarSrc}">
                    </div>
                </div>
            </div>

            <!-- ── Profile Fields ── -->
            <div class="form-grid">
                <div class="form-group"><label>Full Name</label><input name="name" value="${p.name}"></div>
                <div class="form-group"><label>Title / Role</label><input name="title" value="${p.title}"></div>
                <div class="form-group full"><label>Bio / Professional Summary</label><textarea name="bio" rows="5">${p.bio}</textarea></div>
                <div class="form-group"><label>Email</label><input name="email" type="email" value="${p.email}"></div>
                <div class="form-group"><label>Phone</label><input name="phone" value="${p.phone}"></div>
                <div class="form-group"><label>Location</label><input name="location" value="${p.location}"></div>
                <div class="form-group"><label>Degree</label><input name="degree" value="${p.degree}"></div>
                <div class="form-group"><label>University</label><input name="university" value="${p.university}"></div>
                <div class="form-group"><label>Freelance</label><input name="freelance" value="${p.freelance}"></div>
                <div class="form-group"><label>Gaming Alias</label><input name="gamingAlias" value="${p.gamingAlias}"></div>
                <div class="form-group"><label>CV / Resume URL</label><input name="cvUrl" value="${p.cvUrl}"></div>
                <div class="form-group"><label>Tagline</label><input name="tagline" value="${p.tagline}"></div>
            </div>

            <!-- ── Social Links ── -->
            <div class="section-divider"><span>Social Links</span></div>
            <div class="form-grid">
                <div class="form-group"><label><i class="fab fa-github"></i> GitHub</label><input name="socials.github" value="${p.socials.github}"></div>
                <div class="form-group"><label><i class="fab fa-youtube"></i> YouTube</label><input name="socials.youtube" value="${p.socials.youtube}"></div>
                <div class="form-group"><label><i class="fab fa-facebook"></i> Facebook</label><input name="socials.facebook" value="${p.socials.facebook}"></div>
                <div class="form-group"><label><i class="fab fa-linkedin"></i> LinkedIn</label><input name="socials.linkedin" value="${p.socials.linkedin}"></div>
            </div>

            <div class="form-actions">
                <button type="submit" class="btn primary-btn"><i class="fas fa-save"></i> Save Profile</button>
            </div>
        </form>`;

        this.#bindAvatarHandlers(container);
        this.#bindSubmit(container, p);
    }

    // ── Avatar handlers ──────────────────────────────────────────────────────

    #bindAvatarHandlers(container) {
        // File upload → base64
        container.querySelector('#avatar-upload')?.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                this.#setAvatar(ev.target.result);
                container.querySelector('#avatar-url-input').value = '';
            };
            reader.readAsDataURL(file);
        });

        // URL input → preview on Enter or blur
        const urlInput = container.querySelector('#avatar-url-input');
        const applyUrl = () => {
            const url = urlInput.value.trim();
            if (url) this.#setAvatar(url);
        };
        urlInput?.addEventListener('blur', applyUrl);
        urlInput?.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); applyUrl(); } });

        // Remove / reset
        container.querySelector('#avatar-remove-btn')?.addEventListener('click', () => {
            this.#setAvatar('');
            container.querySelector('#avatar-url-input').value = '';
        });
    }

    #setAvatar(src) {
        this.#currentAvatarSrc = src;
        const preview = document.getElementById('avatar-preview');
        const hidden  = document.getElementById('avatar-src-hidden');
        if (!preview || !hidden) return;
        hidden.value = src;
        if (src) {
            preview.style.backgroundImage = `url('${src}')`;
            preview.innerHTML = '';
        } else {
            preview.style.backgroundImage = '';
            preview.innerHTML = '<i class="fas fa-user-circle"></i>';
        }
    }

    // ── Form submit ──────────────────────────────────────────────────────────

    #bindSubmit(container, p) {
        container.querySelector('#profile-form')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const fd   = new FormData(e.target);
            const data = Object.fromEntries(fd.entries());
            const updated = new Profile({
                id: 'main',
                name: data.name, title: data.title, bio: data.bio,
                email: data.email, phone: data.phone, location: data.location,
                degree: data.degree, university: data.university,
                freelance: data.freelance, gamingAlias: data.gamingAlias,
                cvUrl: data.cvUrl, tagline: data.tagline,
                avatarSrc: data.avatarSrc || p.avatarSrc,
                socials: {
                    github:   data['socials.github'],
                    youtube:  data['socials.youtube'],
                    facebook: data['socials.facebook'],
                    linkedin: data['socials.linkedin'],
                },
            });
            await this.#db.put('profile', updated.toPlainObject());
            this.#showSaveToast('Profile saved!');
        });
    }

    #showSaveToast(msg) {
        const t = document.createElement('div');
        t.className = 'save-toast';
        t.textContent = `✓ ${msg}`;
        document.body.appendChild(t);
        requestAnimationFrame(() => t.classList.add('show'));
        setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, 2500);
    }
}
