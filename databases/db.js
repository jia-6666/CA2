export class BaseDB {
    constructor(dbName = "DefaultDB", version = 1, storeName = "items") {
        this.dbName = dbName;
        this.version = version;
        this.storeName = storeName;
        this.db = null;
    }

    async connect(dbName = this.dbName, version = this.version) {
        if (this.db) {
            this.db.close();
            this.db = null;
        }

        this.dbName = dbName;
        this.version = version;

        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                const transaction = event.target.transaction;
                this.onUpgrade(db, transaction);
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve(this.db);
            };

            request.onerror = (event) => reject(`Connection error to '${this.dbName}': ${event.target.error}`);
        });
    }

    async init() {
        return this.connect();
    }

    onUpgrade(db, transaction) {
        if (!db.objectStoreNames.contains(this.storeName)) {
            db.createObjectStore(this.storeName, { keyPath: "id", autoIncrement: true });
        }
    }

    _getStore(mode = "readonly") {
        if (!this.db) {
            throw new Error("Database connection is not open. Call connect() first.");
        }
        const tx = this.db.transaction(this.storeName, mode);
        return tx.objectStore(this.storeName);
    }

    async save(item) {
        return new Promise((resolve, reject) => {
            const store = this._getStore("readwrite");
            const record = { ...item };

            if (!record.id) delete record.id;

            const request = store.put(record);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(`Save error: ${request.error}`);
        });
    }

    async getById(id) {
        return new Promise((resolve, reject) => {
            const store = this._getStore("readonly");
            const request = store.get(id);

            request.onsuccess = () => resolve(request.result || null);
            request.onerror = () => reject(`Get error: ${request.error}`);
        });
    }

    /**
     * Retrieves objects by a date field using an IndexedDB Index.
     * @param {Date|string} [startDate] - Start Date or ISO string filter
     * @param {Date|string} [endDate] - End Date or ISO string filter
     * @returns {Promise<Array>} List of matching items sorted by date
     */
    async getByDate(startDate = null, endDate = null) {
        return new Promise((resolve, reject) => {
            const store = this._getStore("readonly");

            if (!store.indexNames.contains("postTime")) {
                return reject(`Index 'postTime' does not exist on store '${this.storeName}'.`);
            }

            const index = store.index("postTime");
            let range = null;

            // Convert Date objects to ISO string timestamps if needed
            const startISO = startDate instanceof Date ? startDate.toISOString() : startDate;
            const endISO = endDate instanceof Date ? endDate.toISOString() : endDate;

            if (startISO && endISO) {
                range = IDBKeyRange.bound(startISO, endISO);
            } else if (startISO) {
                range = IDBKeyRange.lowerBound(startISO);
            } else if (endISO) {
                range = IDBKeyRange.upperBound(endISO);
            }

            const request = range ? index.getAll(range) : index.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(`GetByDate error: ${request.error}`);
        });
    }

    async getAll() {
        return new Promise((resolve, reject) => {
            const store = this._getStore("readonly");
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(`GetAll error: ${request.error}`);
        });
    }

    async delete(id) {
        return new Promise((resolve, reject) => {
            const store = this._getStore("readwrite");
            const request = store.delete(id);

            request.onsuccess = () => resolve(true);
            request.onerror = () => reject(`Delete error: ${request.error}`);
        });
    }
}