
const fs = require("fs");
const fse = require("fs-extra");
const reportsPath = require("./reporter.config");
const createZipReport = require("./pro.zipper");
const envConfig = require("./env.config");
const mailer = require("./pro.mailer");

const createReportsFolder = function () {
    const reportDir = [reportsPath.mgmtReportPath, reportsPath.devReportPath, reportsPath.videoReportPath]
    if (fs.existsSync(reportsPath.reportsBasePath)) {
        fse.removeSync(reportsPath.reportsBasePath);
    }
    for (let dir of reportDir) {
        if (!fs.existsSync(dir)) {
            fse.ensureDirSync(dir);
        }
    }
}();

exports.config = {
    allScriptsTimeout: envConfig.allScriptsTimeout,
    framework: envConfig.framework,
    directConnect: true, //lets Protractor connect directly to the browser drivers only for chrome and firefox
    baseUrl: envConfig.baseUrl,
    specs: envConfig.testFiles,
    chromeDriver: '../../drivers/manager/selenium/chromedriver_2.43.exe',
    geckoDriver: '../../drivers/manager/selenium/geckodriver-v0.23.0.exe',
    firefoxPath: "C:/Program Files/Mozilla Firefox/firefox.exe",
    multiCapabilities: [
        {
            "browserName": "chrome",
            "version": "ANY",
            "chromeOptions": {
                "args": envConfig.chromeState,
            }
        },
        // {
        //     "browserName": 'firefox',
        //     "version": "ANY",
        //     "moz:firefoxOptions": {
        //         "args": [
        //             '-headless'
        //         ]
        //     }
        // }
    ],
    // capabilities: {
    //     "browserName": "internet explorer",
    //     "version": "ANY"
    // },
    // localSeleniumStandaloneOpts: {
    //     jvmArgs: ["-Dwebdriver.ie.driver=C:\Users\vikassar\AppData\Roaming\nvm\v8.9.4\node_modules\webdriver-manager\selenium\IEDriverServer3.13.0.exe"] // e.g: "node_modules/protractor/node_modules/webdriver-manager/selenium/IEDriverServer_x64_X.XX.X.exe"
    // },
    plugins: [{
        package: "protractor-screenshoter-plugin",
        screenshotPath: reportsPath.devReportPath,
        screenshotOnExpect: "failure+success",
        screenshotOnSpec: "none",
        withLogs: true,
        writeReportFreq: "asap",
        imageToAscii: "none",
        clearFoldersBeforeTest: true
    }],
    jasmineNodeOpts: {
        "showColors": true,
        "defaultTimeoutInterval": envConfig.defaultTimeoutInterval,
        "print": function () { }
    },
    /**
     * The params object will be passed directly to the Protractor instance,
     * and can be accessed from your test as browser.params. It is an arbitrary
     * object and can contain anything you may need in your test.
     */
    params: {
    },
    /**
     * A callback function called once configs are read but before any
     * environment setup. This will only run once, and before onPrepare.
     * You can specify a file containing code to run by setting beforeLaunch to
     * the filename string.
     */
    beforeLaunch: function () { // Do all the typescript 
        if (envConfig.isTsCases) {
            require("ts-node").register({
                project: "tsconfig.json"
            });
        }
    },
    /**
     * A callback function called once protractor is ready and available, and
     * before the specs are executed. If multiple capabilities are being run,
     * this will run once per capability.
     */
    onPrepare: () => {
        if (envConfig.browserMaximize) {
            browser.driver.manage().window().maximize();
        }
        if (!envConfig.isAngular) {
            browser.ignoreSynchronization = true;
        }
        if (envConfig.isEs6Cases) {
            require("babel-core/register");
        }
        jasmine.getEnv().addReporter(envConfig.reportFormat);
        console.log(":::::::::::::::: TEST CASES EXECUTION STARTED ::::::::::::::::::::::");
    },
    /**
     * A callback function called once all tests have finished running and
     * the WebDriver instance has been shut down. It is passed the exit code
     * (0 if the tests passed). afterLaunch must return a promise if you want
     * asynchronous code to be executed before the program exits.
     * This is called only once before the program exits (after onCleanUp).
     */
    afterLaunch: () => {
    },
    /**
     * A callback function called once tests are finished. onComplete can
     * optionally return a promise, which Protractor will wait for before
     * shutting down webdriver.
     *
     * At this point, tests will be done but global objects will still be
     * available.
     */
    onComplete: () => {
        if (envConfig.shootMail) {
            const promise = new Promise(function (resolve, reject) {
                createZipReport().then(function () {
                    mailer.mailZippedReport().then(function () {
                        resolve();
                    }).catch(function () {
                        reject();
                    });

                }).catch(function () {
                    mailer.mailingError().then(function () {
                        resolve();
                    }).catch(function () {
                        reject();
                    });
                });
            });
            return promise;
        } else {
            console.log("::::::::::You have disabled mailing config. Enable it to get email::::::::::");
        }
    },
    /**
     * A callback function called once the tests have finished running and
     * the WebDriver instance has been shut down. It is passed the exit code
     * (0 if the tests passed). This is called once per capability.
     */
    onCleanUp: (exitCode) => {
        process.on("exit", function () {
            console.log("::::::::::: EXITCODE-" + exitCode + "-TO STOP WEBPACKSERVER ctrl+c TWICE :::::::::::");
            process.exit(exitCode);
        });
    },
    /**
     * If set, protractor will save the test output in json format at this path.
     * The path is relative to the location of this config.
     */
    resultJsonOutputFile: envConfig.jsonReport
};
