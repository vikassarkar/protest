
const path = require("path");
const shell = require("shelljs");
const chalk = require("chalk");
const utils = require("./utils");

const test = (protestPath, modulesPath) => {
    console.log("Starting test cases");
    utils.setWebDriver(protestPath, modulesPath).then((resp) => {
        console.log(chalk.bold.green(resp));
        shell.exec("cd " + protestPath + " && npm test", { silent: false, async: true }, (code, output, error) => {
            if (error) {
                console.log(chalk.bold.red(error));
                shell.exit(1);
            }
        });
    }).catch((error) => {
        console.log(chalk.bold.red(error));
    });
};

module.exports = test;