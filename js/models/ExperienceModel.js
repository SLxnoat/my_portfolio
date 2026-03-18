// js/models/ExperienceModel.js
import db from './Database.js';

export default class ExperienceModel {
    constructor(role, organization, dateRange, description, tags) {
        this.role = role;
        this.organization = organization;
        this.dateRange = dateRange;
        this.description = description;
        this.tags = tags || [];
    }

    static getAll() {
        return db.getAll('experiences');
    }

    static getById(id) {
        return db.getById('experiences', id);
    }

    save() {
        const data = {
            role: this.role,
            organization: this.organization,
            dateRange: this.dateRange,
            description: this.description,
            tags: this.tags
        };
        return db.create('experiences', data);
    }

    static update(id, updatedData) {
        return db.update('experiences', id, updatedData);
    }

    static delete(id) {
        return db.delete('experiences', id);
    }
}
