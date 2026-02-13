const Storage = {
    // Save data to localStorage
    save: (key, data) => {
        try {
            const serializedData = JSON.stringify(data);
            localStorage.setItem(key, serializedData);
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    },

    // Get data from localStorage
    get: (key, defaultValue = null) => {
        try {
            const serializedData = localStorage.getItem(key);
            if (serializedData === null) {
                return defaultValue;
            }
            return JSON.parse(serializedData);
        } catch (error) {
            console.error('Error getting from localStorage:', error);
            return defaultValue;
        }
    }
};

export default Storage;
