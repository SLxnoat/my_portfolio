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
                            <div class="form-group" style="grid-column: 1 / -1;">
                                <label style="display: flex; align-items: center; gap: 12px; cursor: pointer;">
                                    <input type="checkbox" name="availableForWork" ${p.availableForWork ? 'checked' : ''} style="width: 18px; height: 18px; accent-color: var(--primary);">
                                    <span style="font-weight: 600;">Currently Available for Work</span>
                                </label>
                            </div>
                        </div>
                        <div class="form-group" style="margin-top:14px">
                            <label>— OR — Image URL</label>
                            <input id="avatar-url-input" type="url" placeholder="https://..." value="${p.avatarSrc && !p.avatarSrc.startsWith('data:') ? p.avatarSrc : ''}">
                        </div>
                        <input type="hidden" name="avatarSrc" id="avatar-src-hidden" value="${p.avatarSrc}">
                    </div>
                </div>
            </div>

            <!-- ── CV Upload Card ── -->
            <div class="avatar-crud-card" style="margin-top:20px;">
                <div class="avatar-info">
                    <h3>Resume / CV (PDF)</h3>
                    <p>Upload your latest CV. This will be safely stored in the database and linked on your portfolio.</p>
                    <div class="avatar-actions" style="margin-top: 10px;">
                        <label class="btn primary-btn avatar-upload-btn" for="cv-upload">
                            <i class="fas fa-file-pdf"></i> Upload PDF
                        </label>
                        <input type="file" id="cv-upload" accept="application/pdf" style="display:none">
                        <button type="button" class="btn secondary-btn" id="cv-remove-btn" style="${p.cvFile ? '' : 'display:none'}">
                            <i class="fas fa-trash"></i> Remove CV
                        </button>
                    </div>
                    <div id="cv-filename-display" style="margin-top: 12px; font-size: 0.85rem; color: var(--primary-light); font-weight: 600;">
                        ${p.cvFileName ? `<i class="fas fa-file-pdf"></i> ${p.cvFileName}` : 'No CV uploaded.'}
                    </div>
                    <input type="hidden" name="cvFile" id="cv-file-hidden" value="${p.cvFile}">
                    <input type="hidden" name="cvFileName" id="cv-filename-hidden" value="${p.cvFileName}">
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
                <div class="form-group"><label>External CV Link (Optional fallback)</label><input name="cvUrl" value="${p.cvUrl}"></div>
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
        this.#bindCvHandlers(container);
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

    // ── CV handlers ──────────────────────────────────────────────────────────

    #bindCvHandlers(container) {
        container.querySelector('#cv-upload')?.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            if (file.type !== 'application/pdf') {
                alert('Please upload a valid PDF file.');
                return;
            }
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                alert('CV file is too large. Please keep it under 5MB.');
                return;
            }

            const reader = new FileReader();
            reader.onload = (ev) => {
                const base64Str = ev.target.result;
                container.querySelector('#cv-file-hidden').value = base64Str;
                container.querySelector('#cv-filename-hidden').value = file.name;
                container.querySelector('#cv-filename-display').innerHTML = `<i class="fas fa-file-pdf"></i> ${file.name}`;
                container.querySelector('#cv-remove-btn').style.display = '';
            };
            reader.readAsDataURL(file);
        });

        container.querySelector('#cv-remove-btn')?.addEventListener('click', () => {
            container.querySelector('#cv-file-hidden').value = '';
            container.querySelector('#cv-filename-hidden').value = '';
            container.querySelector('#cv-filename-display').textContent = 'No CV uploaded.';
            container.querySelector('#cv-remove-btn').style.display = 'none';
            container.querySelector('#cv-upload').value = ''; // reset file input
        });
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
                cvFile: data.cvFile || p.cvFile,
                cvFileName: data.cvFileName || p.cvFileName,
                avatarSrc: data.avatarSrc || p.avatarSrc,
                availableForWork: fd.get('availableForWork') === 'on',
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
