/**
 * Message Model
 * Represents a contact form submission.
 */
export class Message {
    /**
     * @param {Object} data
     * @param {number} [data.id]
     * @param {string} data.name
     * @param {string} data.email
     * @param {string} data.subject
     * @param {string} data.body
     * @param {string} [data.timestamp]
     * @param {boolean} [data.read]
     */
    constructor({
        id,
        name = '',
        email = '',
        subject = '',
        body = '',
        timestamp = new Date().toISOString(),
        read = false,
    } = {}) {
        if (id !== undefined) this.id = id;
        this.name = name;
        this.email = email;
        this.subject = subject;
        this.body = body;
        this.timestamp = timestamp;
        this.read = read;
    }

    toPlainObject() {
        return { ...this };
    }

    static fromPlainObject(obj) {
        return new Message(obj);
    }
}
