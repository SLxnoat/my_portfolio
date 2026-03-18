/**
 * HeroView — Renders the hero section from profile data.
 */
export class HeroView {
    /**
     * @param {Profile} profile
     */
    render(profile) {
        // Name / title / bio
        const nameEl = document.getElementById('hero-name');
        const titleEl = document.getElementById('hero-title');
        const bioEl = document.getElementById('hero-bio');
        const avatarEl = document.getElementById('hero-avatar');
        const cvBtn = document.getElementById('download-cv');

        if (nameEl) nameEl.innerHTML = `Hi, I'm <span class="highlight-text">${profile.name}.</span>`;
        if (titleEl) titleEl.textContent = profile.title;
        if (bioEl) bioEl.textContent = profile.bio;
        if (avatarEl) avatarEl.src = profile.avatarSrc;
        if (cvBtn) cvBtn.dataset.href = profile.cvUrl;

        // Available for work badge
        const badgeEl = document.querySelector('.hero-badge');
        if (badgeEl) {
            badgeEl.style.display = profile.availableForWork ? 'inline-flex' : 'none';
        }

        // Social icons
        const socials = [
            { key: 'github',   icon: 'fab fa-github',   id: 'social-github' },
            { key: 'youtube',  icon: 'fab fa-youtube',  id: 'social-youtube' },
            { key: 'facebook', icon: 'fab fa-facebook', id: 'social-facebook' },
            { key: 'linkedin', icon: 'fab fa-linkedin', id: 'social-linkedin' },
        ];
        socials.forEach(({ key, id }) => {
            const el = document.getElementById(id);
            if (el && profile.socials[key]) {
                el.href = profile.socials[key];
                el.style.display = '';
            }
        });
    }
}
