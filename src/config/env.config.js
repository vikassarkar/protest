
const reportsPath = require("./reporter.config");
const store = require("../process/store");
const utils = require("../process/utils");
const storeState = store.getStore();

const envConfig = {
    allScriptsTimeout: storeState.allScriptsTimeout || 100000,
    framework: storeState.framework || "jasmine", //mocha
    seleniumAddress: storeState.seleniumAddress || "http://localhost:4444/wd/hub",
    baseUrl: storeState.baseUrl || "http://google.com", 
    defaultTimeoutInterval: storeState.defaultTimeoutInterval || 300000,
    reportFormat: utils.getReporter(storeState.reportFormat),
    testFiles: storeState.testFiles || [], //["../example/cases/**/*spec.ts"],
    chromeState: storeState.chromeState || ["--disable-web-security", "--start-maximized", "--always-authorize-plugins"], //"--disable-web-security", "--user-data-dir=~/.e2e-chrome-profile",
    mozillaState: storeState.mozillaState || ["--safe-mode"],
    archiveType: storeState || "zip",
    archiveReportPath: storeState.archiveReportPath || reportsPath.reportsBasePath,
    archiveReportName: storeState.archiveReportName || "report",
    archiveReporter: storeState.archiveReporter || reportsPath.mgmtReportPath,
    emailConfig: storeState.emailConfig || {},
    shootMail: storeState.shootMail || false,
    isTsCases:storeState.isTsCases || false,
    isEs6Cases:storeState.isEs6Cases || false,
    isAngular: storeState.isAngular || false,
    browserMaximize:storeState.browserMaximize || false
};

module.exports = envConfig;