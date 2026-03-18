// js/models/ProjectModel.js
import db from './Database.js';

export default class ProjectModel {
    constructor(title, description, tags, metricValue, metricLabel) {
        this.title = title;
        this.description = description;
        this.tags = tags || []; // Array of strings e.g. ['HTML', 'CSS']
        this.metricValue = metricValue || ''; // e.g. "98"
        this.metricLabel = metricLabel || ''; // e.g. "Performance"
    }

    static getAll() {
        return db.getAll('projects');
    }

    static getById(id) {
        return db.getById('projects', id);
    }

    save() {
        // Convert the OOP object to a plain JS object for JSON serialization
        const data = {
            title: this.title,
            description: this.description,
            tags: this.tags,
            metricValue: this.metricValue,
            metricLabel: this.metricLabel
        };
        
        return db.create('projects', data);
    }

    static update(id, updatedData) {
        return db.update('projects', id, updatedData);
    }

    static delete(id) {
        return db.delete('projects', id);
    }
}
