/**
 * AboutView — Renders the About section from profile + skills data.
 */
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
        const skillsContainer = document.getElementById('skills-list');
        if (skillsContainer && skills.length) {
            skillsContainer.innerHTML = skills.map(skill => `
                <div class="skill">
                    <div class="skill-header">
                        <span class="skill-name"><i class="${skill.icon || 'fas fa-star'}"></i> ${skill.name}</span>
                        <span class="skill-pct">${skill.percentage}%</span>
                    </div>
                    <div class="skill-bar">
                        <div class="skill-fill" data-pct="${skill.percentage}" style="width:0%"></div>
                    </div>
                </div>
            `).join('');
        }
    }

    animateSkillBars() {
        document.querySelectorAll('.skill-fill').forEach(bar => {
            bar.style.width = `${bar.dataset.pct}%`;
        });
    }
}
