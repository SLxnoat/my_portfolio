/**
 * Skill Model
 * Represents a skill with a proficiency percentage.
 */
export class Skill {
    /**
     * @param {Object} data
     * @param {number} [data.id]
     * @param {string} data.name
     * @param {number} data.percentage - 0-100
     * @param {string} [data.icon] - Optional Font Awesome class
     */
    constructor({
        id,
        name = '',
        percentage = 50,
        icon = '',
    } = {}) {
        if (id !== undefined) this.id = id;
        this.name = name;
        this.percentage = Math.min(100, Math.max(0, percentage));
        this.icon = icon;
    }

    toPlainObject() {
        return { ...this };
    }

    static fromPlainObject(obj) {
        return new Skill(obj);
    }
}
