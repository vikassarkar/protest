
const path = require("path");
const shell = require("shelljs");
const chalk = require("chalk");
const utils = require("./utils");
const store = require("./store");

const test = (protestPath, envconfig) => {
    store.setStore(envconfig);
    console.log("Starting test cases");
    const projPath = path.resolve(process.cwd());
    console.log(chalk.bold.green("current path ::-" + projPath));
    console.log(chalk.bold.green("protest path ::-" + protestPath));
    utils.setWebDriver(protestPath).then((resp) => {
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