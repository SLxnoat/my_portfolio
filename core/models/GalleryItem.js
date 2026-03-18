/**
 * GalleryItem Model
 * Represents a single item in the ArtXpert gallery.
 */
export class GalleryItem {
    /**
     * @param {Object} data
     * @param {number} [data.id]
     * @param {string} data.title
     * @param {string} data.description
     * @param {string} data.imageSrc - Relative path or base64 data URL
     * @param {string} data.category
     */
    constructor({
        id,
        title = '',
        description = '',
        imageSrc = '',
        category = 'design',
    } = {}) {
        if (id !== undefined) this.id = id;
        this.title = title;
        this.description = description;
        this.imageSrc = imageSrc;
        this.category = category;
    }

    toPlainObject() {
        return { ...this };
    }

    static fromPlainObject(obj) {
        return new GalleryItem(obj);
    }
}
