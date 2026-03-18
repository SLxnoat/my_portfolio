/**
 * AboutView — Renders the About section from profile + skills data.
 */
import { escapeHTML } from '../../core/utils.js';

export class AboutView {
    /**
     * @param {Profile} profile
     * @param {Skill[]} skills
     */
    render(profile, skills) {
        const bioEl    = document.getElementById('about-bio');
        const nameEl   = document.getElementById('about-name');
        const degreeEl = document.getElementById('about-degree');
        const uniEl    = document.getElementById('about-university');
        const freelanceEl = document.getElementById('about-freelance');
        const aliasEl  = document.getElementById('about-alias');
        const locEl    = document.getElementById('about-location');
        const emailEl  = document.getElementById('about-email');
        const phoneEl  = document.getElementById('about-phone');

        if (bioEl) bioEl.textContent = profile.bio;
        if (nameEl) nameEl.textContent = profile.name;
        if (degreeEl) degreeEl.textContent = profile.degree;
        if (uniEl) uniEl.textContent = profile.university;
        if (freelanceEl) freelanceEl.textContent = profile.freelance;
        if (aliasEl) aliasEl.textContent = profile.gamingAlias;
        if (locEl) locEl.textContent = profile.location;
        if (emailEl) emailEl.textContent = profile.email;
        if (phoneEl) phoneEl.textContent = profile.phone;

        // Skills
        const skillsContainer = document.getElementById('bento-skills');
        if (skillsContainer && skills && skills.length) {
            skillsContainer.innerHTML = skills.map(skill => `
                <div class="bento-skill-pill reveal">
                    <i class="${escapeHTML(skill.icon || 'fas fa-star')}"></i>
                    <span>${escapeHTML(skill.name)}</span>
                </div>
            `).join('');
        }

        // Experience Timeline
        const timelineContainer = document.getElementById('bento-timeline');
        if (timelineContainer && profile.experience && profile.experience.length) {
            timelineContainer.innerHTML = profile.experience.map(exp => `
                <div class="bento-tl-node reveal">
                    <div class="bento-tl-icon"><i class="${escapeHTML(exp.icon || 'fas fa-briefcase')}"></i></div>
                    <div class="bento-tl-content">
                        <h5>${escapeHTML(exp.role)}</h5>
                        <span class="sub">${escapeHTML(exp.period)}</span>
                        <p>${escapeHTML(exp.company)} — ${escapeHTML(exp.desc)}</p>
                    </div>
                </div>
            `).join('');
        }
    }
}
