/**
 * ProjectsView — Renders the projects grid, image banners, highlights, links, and filters.
 */
export class ProjectsView {
    /**
     * @param {Project[]} projects
     */
    render(projects) {
        const grid = document.getElementById('projects-grid');
        if (!grid) return;

        grid.innerHTML = projects.map(p => {
            const linksHtml   = this.#buildLinks(p.links);
            const techHtml    = p.tech.map(t => `<span class="tech-tag">${t}</span>`).join('');
            const imageBanner = p.imageSrc
                ? `<div class="project-img-banner" style="background-image:url('${p.imageSrc}')">
                       <div class="project-img-overlay"></div>
                       <span class="project-category-chip">${p.category}</span>
                   </div>`
                : `<div class="project-icon-banner">
                       <div class="project-icon-wrap"><i class="${p.icon}"></i></div>
                       <span class="project-category-chip">${p.category}</span>
                   </div>`;
            const highlightsHtml = p.highlights && p.highlights.length
                ? `<ul class="project-highlights">${p.highlights.map(h => `<li><i class="fas fa-check-circle"></i>${h}</li>`).join('')}</ul>`
                : '';

            return `
            <div class="project-card reveal" data-category="${p.category}" data-id="${p.id}">
                ${imageBanner}
                <div class="project-info">
                    <h3>${p.title}</h3>
                    <p>${p.description}</p>
                    ${highlightsHtml}
                    <div class="project-tech">${techHtml}</div>
                    <div class="project-links">${linksHtml}</div>
                </div>
            </div>`;
        }).join('');
    }

    #buildLinks(links) {
        const map = [
            { key: 'demo',    label: 'Live Demo',  icon: 'fas fa-globe' },
            { key: 'github',  label: 'GitHub',     icon: 'fab fa-github' },
            { key: 'gallery', label: 'Gallery',    icon: 'fas fa-images' },
            { key: 'youtube', label: 'Channel',    icon: 'fab fa-youtube' },
        ];
        return map
            .filter(({ key }) => links[key])
            .map(({ key, label, icon }) =>
                `<a href="${links[key]}" class="project-link" target="_blank" rel="noopener noreferrer"><i class="${icon}"></i> ${label}</a>`
            ).join('');
    }

    /**
     * Filter visible cards by category.
     * @param {string} filter
     */
    filterCards(filter) {
        document.querySelectorAll('.project-card').forEach(card => {
            const show = filter === 'all' || card.dataset.category === filter;
            card.classList.toggle('hidden', !show);
        });
    }
}
