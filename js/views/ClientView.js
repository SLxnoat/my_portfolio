// js/views/ClientView.js

export default class ClientView {
    constructor() {
        this.projectsContainer = document.getElementById('project-grid');
        this.experienceContainer = document.getElementById('timeline');
        this.skillsBarContainer = document.getElementById('skill-bars');
        
        // Ensure there is a `<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>` in index.html
        this.radarChartCtx = document.getElementById('radarCanvas');
    }

    renderProjects(projects) {
        if (!this.projectsContainer) return;
        this.projectsContainer.innerHTML = '';
        
        projects.forEach(p => {
            const metricsHtml = p.metricValue ? `
                <div class="project-metrics">
                    <div class="metric">
                        <span class="metric-val">${p.metricValue}</span>
                        <span class="metric-key">${p.metricLabel || 'Metric'}</span>
                    </div>
                </div>
            ` : '';

            const tagsHtml = (p.tags || []).map(t => `<span class="tech-pill">${t}</span>`).join('');

            const html = `
                <div class="project-card">
                    <div class="glow-orb"></div>
                    <div class="project-title">${p.title}</div>
                    <div class="project-desc">${p.description}</div>
                    <div class="project-tech">
                        ${tagsHtml}
                    </div>
                    ${metricsHtml}
                </div>
            `;
            this.projectsContainer.insertAdjacentHTML('beforeend', html);
        });
    }

    renderExperiences(experiences) {
        if (!this.experienceContainer) return;
        this.experienceContainer.innerHTML = '';
        
        experiences.sort((a, b) => new Date(b.dateRange.split('-')[0]) - new Date(a.dateRange.split('-')[0]));
        
        experiences.forEach(ex => {
            const tagsHtml = (ex.tags || []).map(t => `<span class="tl-tag">${t}</span>`).join('');
            
            const html = `
                <div class="timeline-item">
                    <div class="timeline-dot"></div>
                    <div class="timeline-date">${ex.dateRange}</div>
                    <div class="timeline-role">${ex.role}</div>
                    <div class="timeline-org">${ex.organization}</div>
                    <div class="timeline-desc">${ex.description}</div>
                    <div class="timeline-tags">
                        ${tagsHtml}
                    </div>
                </div>
            `;
            this.experienceContainer.insertAdjacentHTML('beforeend', html);
        });
    }

    renderSkills(skills) {
        if (!this.skillsBarContainer) return;
        this.skillsBarContainer.innerHTML = '';

        const barSkills = skills.filter(s => !s.isRadar);
        const radarSkills = skills.filter(s => s.isRadar);

        // Render Bars
        barSkills.forEach(sk => {
            const html = `
                <div class="skill-bar-item">
                    <div class="skill-bar-header">
                        <span>${sk.name}</span>
                        <span class="skill-bar-pct">${sk.percentage}%</span>
                    </div>
                    <div class="skill-bar-track">
                        <div class="skill-bar-fill" style="width: ${sk.percentage}%"></div>
                    </div>
                </div>
            `;
            this.skillsBarContainer.insertAdjacentHTML('beforeend', html);
        });

        // Setup Radar Chart
        if (this.radarChartCtx && window.Chart) {
            this.setupRadarChart(radarSkills);
        }
    }

    setupRadarChart(radarSkills) {
        const labels = radarSkills.map(s => s.name);
        const data = radarSkills.map(s => s.percentage);

        // Destroy old chart if exists (assuming Chart JS attaches instance to canvas)
        if(window.radarChartInstance) {
            window.radarChartInstance.destroy();
        }

        window.radarChartInstance = new Chart(this.radarChartCtx, {
            type: 'radar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Proficiency',
                    data: data,
                    backgroundColor: 'rgba(0, 245, 212, 0.2)',
                    borderColor: 'rgba(0, 245, 212, 1)',
                    pointBackgroundColor: 'rgba(0, 191, 255, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(0, 191, 255, 1)'
                }]
            },
            options: {
                responsive: true,
                scales: {
                    r: {
                        angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        pointLabels: { color: 'rgba(255, 255, 255, 0.7)', font: { family: 'Orbitron', size: 10 } },
                        ticks: { display: false, max: 100, min: 0 }
                    }
                },
                plugins: { legend: { display: false } }
            }
        });
    }
}
