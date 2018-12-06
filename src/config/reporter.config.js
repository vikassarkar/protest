
const path = require("path");
const store = require("../process/store");
const storeState = store.getStore();

const reportsPath = {
    devReportPath: storeState.reportconfig.devReportPath || path.join(__dirname, "../../__report__/__dev-report__"),
    videoReportPath: storeState.reportconfig.videoReportPath || path.join(__dirname, "../../__report__/__video-report__"),
    mgmtReportPath: storeState.reportconfig.mgmtReportPath || path.join(__dirname, "../../__report__/__mgmt-report__"),
    reportsBasePath: storeState.reportconfig.reportconfig || path.join(__dirname, "../../__report__")
};

module.exports = reportsPath;