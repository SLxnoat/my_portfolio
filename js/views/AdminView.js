// js/views/AdminView.js

export default class AdminView {
    constructor() {
        // Auth elements
        this.authGate = document.getElementById('auth-gate');
        this.dashboard = document.getElementById('dashboard');
        this.loginForm = document.getElementById('login-form');
        this.pinInput = document.getElementById('admin-pin');
        this.authError = document.getElementById('auth-error');
        this.logoutBtn = document.getElementById('logout-btn');

        // Navigation
        this.navLinks = document.querySelectorAll('.nav-link');
        this.panels = document.querySelectorAll('.panel');

        // Forms
        this.projectForm = document.getElementById('project-form');
        this.experienceForm = document.getElementById('experience-form');
        this.skillForm = document.getElementById('skill-form');

        // Table Bodies
        this.projectsTableBody = document.getElementById('projects-table-body');
        this.experienceTableBody = document.getElementById('experience-table-body');
        this.skillsTableBody = document.getElementById('skills-table-body');

        this.initNav();
    }

    initNav() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                this.navLinks.forEach(l => l.classList.remove('active'));
                this.panels.forEach(p => p.classList.remove('active'));
                
                e.target.classList.add('active');
                const targetPanelId = e.target.getAttribute('data-target');
                document.getElementById(targetPanelId).classList.add('active');
            });
        });
    }

    // --- Authentication ---
    showDashboard() {
        this.authGate.style.display = 'none';
        this.dashboard.style.display = 'flex';
    }

    showAuthGate() {
        this.dashboard.style.display = 'none';
        this.authGate.style.display = 'flex';
        this.pinInput.value = '';
    }

    showAuthError() {
        this.authError.style.display = 'block';
        setTimeout(() => this.authError.style.display = 'none', 3000);
    }

    bindLogin(handler) {
        this.loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handler(this.pinInput.value);
        });
    }

    bindLogout(handler) {
        this.logoutBtn.addEventListener('click', handler);
    }

    // --- Projects ---
    bindSaveProject(handler) {
        this.projectForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const data = {
                id: document.getElementById('project-id').value,
                title: document.getElementById('project-title').value,
                description: document.getElementById('project-desc').value,
                tags: document.getElementById('project-tags').value.split(',').map(s=>s.trim()).filter(Boolean),
                metricValue: document.getElementById('project-metric-val').value,
                metricLabel: document.getElementById('project-metric-label').value
            };
            handler(data);
            this.projectForm.reset();
            document.getElementById('project-id').value = '';
        });
    }

    renderProjects(projects, editHandler, deleteHandler) {
        this.projectsTableBody.innerHTML = '';
        projects.forEach(p => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${p.title}</td>
                <td>${(p.tags || []).join(', ')}</td>
                <td class="actions">
                    <button class="btn btn-sm edit-btn">Edit</button>
                    <button class="btn btn-sm btn-danger delete-btn">Del</button>
                </td>
            `;
            
            tr.querySelector('.edit-btn').addEventListener('click', () => {
                document.getElementById('project-id').value = p.id;
                document.getElementById('project-title').value = p.title;
                document.getElementById('project-desc').value = p.description;
                document.getElementById('project-tags').value = (p.tags || []).join(', ');
                document.getElementById('project-metric-val').value = p.metricValue || '';
                document.getElementById('project-metric-label').value = p.metricLabel || '';
            });

            tr.querySelector('.delete-btn').addEventListener('click', () => {
                if(confirm('Delete project?')) deleteHandler(p.id);
            });

            this.projectsTableBody.appendChild(tr);
        });
    }

    // --- Experience ---
    bindSaveExperience(handler) {
        this.experienceForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const data = {
                id: document.getElementById('exp-id').value,
                role: document.getElementById('exp-role').value,
                organization: document.getElementById('exp-org').value,
                dateRange: document.getElementById('exp-date').value,
                description: document.getElementById('exp-desc').value,
                tags: document.getElementById('exp-tags').value.split(',').map(s=>s.trim()).filter(Boolean)
            };
            handler(data);
            this.experienceForm.reset();
            document.getElementById('exp-id').value = '';
        });
    }

    renderExperiences(experiences, editHandler, deleteHandler) {
        this.experienceTableBody.innerHTML = '';
        experiences.forEach(ex => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${ex.role}</td>
                <td>${ex.organization}</td>
                <td>${ex.dateRange}</td>
                <td class="actions">
                    <button class="btn btn-sm edit-btn">Edit</button>
                    <button class="btn btn-sm btn-danger delete-btn">Del</button>
                </td>
            `;
            
            tr.querySelector('.edit-btn').addEventListener('click', () => {
                document.getElementById('exp-id').value = ex.id;
                document.getElementById('exp-role').value = ex.role;
                document.getElementById('exp-org').value = ex.organization;
                document.getElementById('exp-date').value = ex.dateRange;
                document.getElementById('exp-desc').value = ex.description;
                document.getElementById('exp-tags').value = (ex.tags || []).join(', ');
            });

            tr.querySelector('.delete-btn').addEventListener('click', () => {
                if(confirm('Delete experience?')) deleteHandler(ex.id);
            });

            this.experienceTableBody.appendChild(tr);
        });
    }

    // --- Skills ---
    bindSaveSkill(handler) {
        this.skillForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const data = {
                id: document.getElementById('skill-id').value,
                name: document.getElementById('skill-name').value,
                percentage: parseInt(document.getElementById('skill-pct').value),
                isRadar: document.getElementById('skill-radar').checked
            };
            handler(data);
            this.skillForm.reset();
            document.getElementById('skill-id').value = '';
        });
    }

    renderSkills(skills, editHandler, deleteHandler) {
        this.skillsTableBody.innerHTML = '';
        skills.forEach(sk => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${sk.name}</td>
                <td>${sk.percentage}%</td>
                <td>${sk.isRadar ? 'Yes' : 'No'}</td>
                <td class="actions">
                    <button class="btn btn-sm edit-btn">Edit</button>
                    <button class="btn btn-sm btn-danger delete-btn">Del</button>
                </td>
            `;
            
            tr.querySelector('.edit-btn').addEventListener('click', () => {
                document.getElementById('skill-id').value = sk.id;
                document.getElementById('skill-name').value = sk.name;
                document.getElementById('skill-pct').value = sk.percentage;
                document.getElementById('skill-radar').checked = sk.isRadar;
            });

            tr.querySelector('.delete-btn').addEventListener('click', () => {
                if(confirm('Delete skill?')) deleteHandler(sk.id);
            });

            this.skillsTableBody.appendChild(tr);
        });
    }
}
