// js/controllers/AdminController.js

import AdminView from '../views/AdminView.js';
import ProjectModel from '../models/ProjectModel.js';
import ExperienceModel from '../models/ExperienceModel.js';
import SkillModel from '../models/SkillModel.js';

export default class AdminController {
    constructor() {
        this.view = new AdminView();
        
        // Simple client-side auth state
        // For a real production app this is extremely insecure and should use a backend,
        // but it satisfies the constraints of "Pure client-side MVP without Node.js".
        this.masterPin = '1234'; 
    }

    init() {
        // Authenticate
        this.view.bindLogin(this.handleLogin.bind(this));
        this.view.bindLogout(this.handleLogout.bind(this));

        // Check active session
        if (sessionStorage.getItem('adminAuth') === 'true') {
            this.authSuccess();
        }

        // Bind form submissions
        this.view.bindSaveProject(this.handleSaveProject.bind(this));
        this.view.bindSaveExperience(this.handleSaveExperience.bind(this));
        this.view.bindSaveSkill(this.handleSaveSkill.bind(this));
    }

    handleLogin(pin) {
        if (pin === this.masterPin) {
            sessionStorage.setItem('adminAuth', 'true');
            this.authSuccess();
        } else {
            this.view.showAuthError();
        }
    }

    handleLogout() {
        sessionStorage.removeItem('adminAuth');
        this.view.showAuthGate();
    }

    authSuccess() {
        this.view.showDashboard();
        this.refreshData();
    }

    refreshData() {
        // Fetch arrays from DB
        const projects = ProjectModel.getAll();
        const experiences = ExperienceModel.getAll();
        const skills = SkillModel.getAll();

        // Pass to view to render
        this.view.renderProjects(projects, null, this.handleDeleteProject.bind(this));
        this.view.renderExperiences(experiences, null, this.handleDeleteExperience.bind(this));
        this.view.renderSkills(skills, null, this.handleDeleteSkill.bind(this));
    }

    // --- Projects Handlers ---
    handleSaveProject(data) {
        if (data.id) {
            ProjectModel.update(data.id, data);
        } else {
            new ProjectModel(data.title, data.description, data.tags, data.metricValue, data.metricLabel).save();
        }
        this.refreshData();
    }

    handleDeleteProject(id) {
        ProjectModel.delete(id);
        this.refreshData();
    }

    // --- Experience Handlers ---
    handleSaveExperience(data) {
        if (data.id) {
            ExperienceModel.update(data.id, data);
        } else {
            new ExperienceModel(data.role, data.organization, data.dateRange, data.description, data.tags).save();
        }
        this.refreshData();
    }

    handleDeleteExperience(id) {
        ExperienceModel.delete(id);
        this.refreshData();
    }

    // --- Skill Handlers ---
    handleSaveSkill(data) {
        if (data.id) {
            SkillModel.update(data.id, data);
        } else {
            new SkillModel(data.name, data.percentage, data.isRadar).save();
        }
        this.refreshData();
    }

    handleDeleteSkill(id) {
        SkillModel.delete(id);
        this.refreshData();
    }
}
