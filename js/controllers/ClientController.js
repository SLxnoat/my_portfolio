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
        // Force a fresh seed using Charuka's data
        if (!localStorage.getItem('charuka_seeded_v1')) {
            localStorage.clear();
            localStorage.setItem('charuka_seeded_v1', 'true');
        }
        
        this.seedInitialDataIfEmpty();
        this.loadData();
    }

    seedInitialDataIfEmpty() {
        if (ProjectModel.getAll().length === 0) {
            new ProjectModel('Lanka Microfinance AI', 'Alternative credit scoring system for Sri Lankan micro-entrepreneurs using behavioral signals.', ['Python', 'XGBoost', 'Scikit-learn', 'Streamlit'], '96%', 'Accuracy').save();
            new ProjectModel('Project ARIA', 'Adaptive Role Intelligence Assistant. A local LLM-powered AI assistant that generates personalised learning roadmaps.', ['Python', 'Ollama', 'LLaMA 3.2', 'Streamlit'], 'Local', 'LLM').save();
            new ProjectModel('Digit Identifier', 'Interactive Handwritten Digit Classifier trained on MNIST with real-time prediction and confidence scores.', ['TensorFlow', 'Keras', 'CNN'], '95%', 'Test Accuracy').save();
            new ProjectModel('Lanka Auto Advisor', 'AI Vehicle Price Prediction incorporating USD/LKR exchange rates and inflation data as economic context features.', ['Python', 'XGBoost', 'Scikit-learn'], '0.9422', 'R² Score').save();
            new ProjectModel('WhaleLink', 'AI-powered marine monitoring dashboard predicting whale behaviour patterns.', ['React', 'Flask', 'REST API'], 'Active', 'Development').save();
        }

        if (ExperienceModel.getAll().length === 0) {
            new ExperienceModel('Founder & Lead Developer', 'ArtXpert-Code', '2024 - Present', 'Maintaining public repositories spanning ML pipelines, NLP systems, LLM integrations, REST APIs, and full-stack web apps. Practising MLOps principles.', ['MLOps', 'Docker', 'CI/CD']).save();
            new ExperienceModel('BSc (Hons) in Info Tech', 'Horizon Campus, Sri Lanka', '2023 - 2027', 'Focusing on Software Engineering, Web & Mobile Development, and AI Systems.', ['AI Systems', 'Software Engineering']).save();
            new ExperienceModel('Founder & Graphic Designer', 'ArtXpert Design Brand', '2022 - Present', 'Client-facing design business delivering brand identity and digital illustration using Adobe Creative Suite.', ['Design', 'Adobe']).save();
            new ExperienceModel('Diploma in ICT', 'IMBS Metro Campus', '2019 - 2020', 'Foundation in information and communication technology.', ['ICT']).save();
        }

        if (SkillModel.getAll().length === 0) {
            // Bars
            new SkillModel('Python / ML', 95, false).save();
            new SkillModel('Deep Learning (CNN/NLP)', 90, false).save();
            new SkillModel('Data Science', 88, false).save();
            new SkillModel('Generative AI (LLMs)', 85, false).save();
            new SkillModel('Web Dev (React/Flask)', 82, false).save();
            
            // Radar
            new SkillModel('Machine Learning', 95, true).save();
            new SkillModel('NLP & LLMs', 90, true).save();
            new SkillModel('MLOps & Cloud', 82, true).save();
            new SkillModel('Full-Stack', 85, true).save();
            new SkillModel('Data Science', 88, true).save();
            new SkillModel('Problem Solving', 92, true).save();
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
