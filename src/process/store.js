const Configstore = require('configstore');
const storeConfig = new Configstore("protestConfig");

const store = {
    setStore: (config) => {
        storeConfig.all = config;
    },
    
    getStore: () => {
        return storeConfig.all;
    }
};

module.exports = store;