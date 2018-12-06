const Configstore = require('configstore');
const storeConfig = new Configstore("prottestConfig");

const store = {
    setStore: (config) => {
        storeConfig.all = config;
    },
    
    getStore: () => {
        return storeConfig.all;
    }
};

module.exports = store;