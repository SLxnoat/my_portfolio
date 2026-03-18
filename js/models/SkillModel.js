// js/models/SkillModel.js
import db from './Database.js';

export default class SkillModel {
    constructor(name, percentage, isRadar = false) {
        this.name = name;
        this.percentage = percentage; // Number 0-100
        this.isRadar = isRadar; // Boolean pointing if this belongs to radar chart
    }

    static getAll() {
        return db.getAll('skills');
    }

    static getById(id) {
        return db.getById('skills', id);
    }

    save() {
        const data = {
            name: this.name,
            percentage: this.percentage,
            isRadar: this.isRadar
        };
        return db.create('skills', data);
    }

    static update(id, updatedData) {
        return db.update('skills', id, updatedData);
    }

    static delete(id) {
        return db.delete('skills', id);
    }
}
