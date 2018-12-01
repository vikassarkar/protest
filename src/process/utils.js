
const fs = require("fs");
const fse = require("fs-extra");
const reporter = require("../config/pro.reporter");
const reportsPath = require("../config/reporter.config");

const utils = {
    setWebDriver: function (protestPath) {
        const promise = new Promise(function (resolve, reject) {
            const refSrcDir = protestPath + "/drivers/webdriver-manager"
            const webDriverPath = protestPath + "/node_modules/protractor/node_modules/webdriver-manager"
            if (fs.existsSync(webDriverPath)) {
                if (!fs.existsSync(webDriverPath + "/selenium")) {
                    fse.ensureDirSync(webDriverPath + "/selenium");
                    fse.copySync(refSrcDir + "/selenium", webDriverPath + "/selenium", { overwrite: true }, err => {
                        if (err) {
                            console.log(':::~~error in copying webdriver:' + err + '~~:::');
                            fse.emptyDirSync(webDriverPath + "/selenium");
                            reject('Error in copying to temp directory');
                        }
                        resolve(':::~~ webdriver created~~:::');
                    });
                }
            } else {
                fse.ensureDirSync(webDriverPath);
                fse.copySync(refSrcDir, webDriverPath, { overwrite: true }, err => {
                    if (err) {
                        console.log(':::~~error in copying webdriver:' + err + '~~:::');
                        fse.emptyDirSync(webDriverPath);
                        reject('Error in copying to temp directory');
                    }
                    resolve(':::~~ webdriver created~~:::');
                });
            }
            resolve(':::~~ webdriver already exist ~~:::');
        });
        return promise;
    },
    createReportsFolder: () => {
        const reportDir = [reportsPath.mgmtReportPath, reportsPath.devReportPath, reportsPath.videoReportPath]
        if (fs.existsSync(reportsPath.reportsBasePath)) {
            fse.removeSync(reportsPath.reportsBasePath);
        }
        for (let dir of reportDir) {
            if (!fs.existsSync(dir)) {
                fse.ensureDirSync(dir);
            }
        }
    },
    getReporter: (report) => {
        switch (report) {
            case "video":
                return (reporter.videoReport);
            case "sanity":
                return (reporter.sanityReport);
            default:
                return (reporter.specReport);
        }
    }
};

module.exports = utils;
