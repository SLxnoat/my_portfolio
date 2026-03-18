// js/models/Database.js

/**
 * Singleton Database Class using LocalStorage
 * Serves as the persistent storage layer for the application
 */
class Database {
    constructor() {
        if (Database.instance) {
            return Database.instance;
        }
        
        // Define default tables (keys)
        this.tables = ['projects', 'experiences', 'skills'];
        this.init();
        
        Database.instance = this;
    }

    // Initialize missing tables with empty arrays
    init() {
        this.tables.forEach(table => {
            if (!localStorage.getItem(table)) {
                localStorage.setItem(table, JSON.stringify([]));
            }
        });
    }

    // Read all records from a table
    getAll(table) {
        try {
            return JSON.parse(localStorage.getItem(table)) || [];
        } catch (e) {
            console.error(`Error reading ${table} from local storage`, e);
            return [];
        }
    }

    // Save all records to a table
    saveAll(table, data) {
        try {
            localStorage.setItem(table, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error(`Error saving ${table} to local storage`, e);
            return false;
        }
    }

    // Get a specific record by ID
    getById(table, id) {
        const data = this.getAll(table);
        return data.find(item => item.id === id) || null;
    }

    // Create a new record
    create(table, record) {
        const data = this.getAll(table);
        
        // Generate a random ID if none exists
        if (!record.id) {
            record.id = Date.now().toString(36) + Math.random().toString(36).substr(2);
        }
        
        data.push(record);
        this.saveAll(table, data);
        return record;
    }

    // Update an existing record
    update(table, id, updatedFields) {
        const data = this.getAll(table);
        const index = data.findIndex(item => item.id === id);
        
        if (index !== -1) {
            data[index] = { ...data[index], ...updatedFields, id }; // Ensure ID stays the same
            this.saveAll(table, data);
            return data[index];
        }
        return null;
    }

    // Delete a record
    delete(table, id) {
        const data = this.getAll(table);
        const filteredData = data.filter(item => item.id !== id);
        
        if (data.length !== filteredData.length) {
            this.saveAll(table, filteredData);
            return true;
        }
        return false;
    }
}

// Export the singleton instance
const db = new Database();
export default db;
