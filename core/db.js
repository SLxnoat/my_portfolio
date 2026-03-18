/**
 * Database — IndexedDB Singleton Wrapper
 * Core data layer for the Portfolio System.
 * Provides a Promise-based API over IndexedDB.
 */
export class Database {
    static #instance = null;
    static DB_NAME = 'PortfolioDB';
    static DB_VERSION = 1;

    #db = null;

    constructor() {
        if (Database.#instance) return Database.#instance;
        Database.#instance = this;
    }

    static getInstance() {
        if (!Database.#instance) {
            Database.#instance = new Database();
        }
        return Database.#instance;
    }

    /**
     * Opens the database and creates object stores if needed.
     * @returns {Promise<IDBDatabase>}
     */
    open() {
        return new Promise((resolve, reject) => {
            if (this.#db) return resolve(this.#db);

            const request = indexedDB.open(Database.DB_NAME, Database.DB_VERSION);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                this.#createStores(db);
            };

            request.onsuccess = (event) => {
                this.#db = event.target.result;
                resolve(this.#db);
            };

            request.onerror = (event) => {
                reject(new Error(`Failed to open DB: ${event.target.error}`));
            };
        });
    }

    #createStores(db) {
        const stores = [
            { name: 'profile',   keyPath: 'id', autoIncrement: false },
            { name: 'projects',  keyPath: 'id', autoIncrement: true },
            { name: 'gallery',   keyPath: 'id', autoIncrement: true },
            { name: 'messages',  keyPath: 'id', autoIncrement: true },
            { name: 'skills',    keyPath: 'id', autoIncrement: true },
            { name: 'auth',      keyPath: 'id', autoIncrement: false },
        ];
        stores.forEach(({ name, keyPath, autoIncrement }) => {
            if (!db.objectStoreNames.contains(name)) {
                db.createObjectStore(name, { keyPath, autoIncrement });
            }
        });
    }

    /**
     * Retrieve all records from a store.
     * @param {string} storeName
     * @returns {Promise<Array>}
     */
    getAll(storeName) {
        return new Promise((resolve, reject) => {
            const tx = this.#db.transaction(storeName, 'readonly');
            const request = tx.objectStore(storeName).getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Retrieve a single record by key.
     * @param {string} storeName
     * @param {*} key
     * @returns {Promise<Object|undefined>}
     */
    get(storeName, key) {
        return new Promise((resolve, reject) => {
            const tx = this.#db.transaction(storeName, 'readonly');
            const request = tx.objectStore(storeName).get(key);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Add or update a record (upsert).
     * @param {string} storeName
     * @param {Object} data
     * @returns {Promise<IDBValidKey>}
     */
    put(storeName, data) {
        return new Promise((resolve, reject) => {
            const tx = this.#db.transaction(storeName, 'readwrite');
            const request = tx.objectStore(storeName).put(data);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Delete a record by key.
     * @param {string} storeName
     * @param {*} key
     * @returns {Promise<void>}
     */
    delete(storeName, key) {
        return new Promise((resolve, reject) => {
            const tx = this.#db.transaction(storeName, 'readwrite');
            const request = tx.objectStore(storeName).delete(key);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Clear all records in a store.
     * @param {string} storeName
     * @returns {Promise<void>}
     */
    clear(storeName) {
        return new Promise((resolve, reject) => {
            const tx = this.#db.transaction(storeName, 'readwrite');
            const request = tx.objectStore(storeName).clear();
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Count records in a store.
     * @param {string} storeName
     * @returns {Promise<number>}
     */
    count(storeName) {
        return new Promise((resolve, reject) => {
            const tx = this.#db.transaction(storeName, 'readonly');
            const request = tx.objectStore(storeName).count();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
}
