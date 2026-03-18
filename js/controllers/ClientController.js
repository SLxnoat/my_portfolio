// js/controllers/ClientController.js

import ClientView from '../views/ClientView.js';
import ProjectModel from '../models/ProjectModel.js';
import ExperienceModel from '../models/ExperienceModel.js';
import SkillModel from '../models/SkillModel.js';

export default class ClientController {
    constructor() {
        this.view = new ClientView();
    }

    init() {
        this.seedInitialDataIfEmpty();
        this.loadData();
    }

    seedInitialDataIfEmpty() {
        // If DB is completely empty (first run), add some placeholder stuff so it doesn't look broken.
        // E.g. The user's original HTML hardcoded values can be re-added here if needed.
        if (ProjectModel.getAll().length === 0) {
            new ProjectModel('Quantum Neural Engine', 'Architected a distributed neural network framework reducing inference latency by 45%.', ['Python', 'TensorFlow', 'CUDA'], '45%', 'Latency Reduction').save();
            new ProjectModel('Autonomous Trade Bot', 'Built an ML-driven high-frequency trading system leveraging sentiment analysis.', ['Node.js', 'PyTorch', 'Redis'], '$1.2M', 'Volume Managed').save();
        }

        if (ExperienceModel.getAll().length === 0) {
            new ExperienceModel('Senior Machine Learning Engineer', 'TechCorp Innovations', '2023 - Present', 'Leading the AI research team focusing on generative models.', ['PyTorch', 'AWS', 'LLMs']).save();
            new ExperienceModel('Data Scientist', 'Global Data Inc.', '2020 - 2023', 'Developed predictive models for customer churn resulting in 20% retention increase.', ['Python', 'SQL', 'Scikit-Learn']).save();
        }

        if (SkillModel.getAll().length === 0) {
            // Bars
            new SkillModel('Python / C++', 95, false).save();
            new SkillModel('Machine Learning / AI', 92, false).save();
            new SkillModel('Data Engineering', 88, false).save();
            // Radar
            new SkillModel('Deep Learning', 90, true).save();
            new SkillModel('Cloud Architecture', 80, true).save();
            new SkillModel('DevOps', 75, true).save();
            new SkillModel('Algorithms', 95, true).save();
            new SkillModel('System Design', 85, true).save();
        }
    }

    loadData() {
        const projects = ProjectModel.getAll();
        const experiences = ExperienceModel.getAll();
        const skills = SkillModel.getAll();

        this.view.renderProjects(projects);
        this.view.renderExperiences(experiences);
        this.view.renderSkills(skills);
    }
}
