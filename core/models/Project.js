/**
 * Project Model
 * Represents a single portfolio project.
 */
export class Project {
    /**
     * @param {Object} data
     * @param {number} [data.id] - Auto-assigned by IndexedDB
     * @param {string} data.title
     * @param {string} data.description
     * @param {string} data.category - 'web' | 'app' | 'design' | 'gaming'
     * @param {string[]} data.tech
     * @param {string} data.icon - Font Awesome class string
     * @param {Object} data.links - { demo, github, gallery, youtube }
     */
    constructor({
        id,
        title = '',
        description = '',
        category = 'web',
        tech = [],
        icon = 'fas fa-code',
        links = {},
        imageSrc = '',
        highlights = [],
    } = {}) {
        if (id !== undefined) this.id = id;
        this.title = title;
        this.description = description;
        this.category = category;
        this.tech = Array.isArray(tech) ? tech : [];
        this.icon = icon;
        this.imageSrc = imageSrc;
        this.highlights = Array.isArray(highlights) ? highlights : [];
        this.links = {
            demo: links.demo || '',
            github: links.github || '',
            gallery: links.gallery || '',
            youtube: links.youtube || '',
        };
    }

    toPlainObject() {
        return { ...this };
    }

    static fromPlainObject(obj) {
        return new Project(obj);
    }
}
