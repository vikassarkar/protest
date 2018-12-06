
const fs = require("fs");
const fse = require("fs-extra");

const utils = {
    setWebDriver: function (protestPath, modulesPath) {
        const promise = new Promise(function (resolve, reject) {
            const refSrcDir = protestPath + "/drivers/manager";
            const webDriverPath = modulesPath + "/node_modules/protractor/node_modules/webdriver-manager";
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
    }
};

module.exports = utils;
