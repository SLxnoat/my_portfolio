/**
 * ProfileController — Load and save the portfolio Profile in admin.
 */
import { Database } from '../../core/db.js';
import { Profile } from '../../core/models/Profile.js';

export class ProfileController {
    #db;

    constructor() {
        this.#db = Database.getInstance();
    }

    async render(container) {
        const raw = await this.#db.get('profile', 'main');
        const p = raw ? Profile.fromPlainObject(raw) : new Profile();

        container.innerHTML = `
        <form id="profile-form" class="admin-form">
            <div class="form-grid">
                <div class="form-group"><label>Full Name</label><input name="name" value="${p.name}"></div>
                <div class="form-group"><label>Title</label><input name="title" value="${p.title}"></div>
                <div class="form-group full"><label>Bio</label><textarea name="bio" rows="4">${p.bio}</textarea></div>
                <div class="form-group"><label>Email</label><input name="email" type="email" value="${p.email}"></div>
                <div class="form-group"><label>Phone</label><input name="phone" value="${p.phone}"></div>
                <div class="form-group"><label>Location</label><input name="location" value="${p.location}"></div>
                <div class="form-group"><label>Degree</label><input name="degree" value="${p.degree}"></div>
                <div class="form-group"><label>University</label><input name="university" value="${p.university}"></div>
                <div class="form-group"><label>Freelance</label><input name="freelance" value="${p.freelance}"></div>
                <div class="form-group"><label>Gaming Alias</label><input name="gamingAlias" value="${p.gamingAlias}"></div>
                <div class="form-group"><label>CV URL</label><input name="cvUrl" value="${p.cvUrl}"></div>
                <div class="form-group"><label>Tagline</label><input name="tagline" value="${p.tagline}"></div>
                <div class="form-group"><label><i class="fab fa-github"></i> GitHub</label><input name="socials.github" value="${p.socials.github}"></div>
                <div class="form-group"><label><i class="fab fa-youtube"></i> YouTube</label><input name="socials.youtube" value="${p.socials.youtube}"></div>
                <div class="form-group"><label><i class="fab fa-facebook"></i> Facebook</label><input name="socials.facebook" value="${p.socials.facebook}"></div>
                <div class="form-group"><label><i class="fab fa-linkedin"></i> LinkedIn</label><input name="socials.linkedin" value="${p.socials.linkedin}"></div>
            </div>
            <div class="form-actions">
                <button type="submit" class="btn primary-btn"><i class="fas fa-save"></i> Save Profile</button>
            </div>
        </form>`;

        container.querySelector('#profile-form')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const fd = new FormData(e.target);
            const data = Object.fromEntries(fd.entries());
            const updated = new Profile({
                id: 'main',
                name: data.name, title: data.title, bio: data.bio,
                email: data.email, phone: data.phone, location: data.location,
                degree: data.degree, university: data.university,
                freelance: data.freelance, gamingAlias: data.gamingAlias,
                cvUrl: data.cvUrl, tagline: data.tagline,
                avatarSrc: p.avatarSrc,
                socials: {
                    github: data['socials.github'],
                    youtube: data['socials.youtube'],
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
        t.className = 'save-toast'; t.textContent = `✓ ${msg}`;
        document.body.appendChild(t);
        requestAnimationFrame(() => t.classList.add('show'));
        setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, 2500);
    }
}
