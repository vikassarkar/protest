
const envConfig = require("./env.Config");
const fs = require("fs");
const fse = require("fs-extra");
const jsdom = require("jsdom");
const EasyZip = require('easy-zip').EasyZip;
const decode = require('unescape');
const reportsPath = require("./reporter.config");
const zip = new EasyZip();
const { JSDOM } = jsdom;

const createZipReport = function () {
    console.log(":::::::: 👥 ZIPPING REPORT EXECUTION STARTED 👥 :::::::::::::");
    const tempReportPath = reportsPath.reportsBasePath + "/report/";
    const zippingReportPathArray = envConfig.archiveReporter.split("\\");
    const reporterName = zippingReportPathArray[zippingReportPathArray.length - 1];
    
    /** clean temporary folder and create an empty temp folder */
    const cleanTempFolder = function () {
        if (fs.existsSync(tempReportPath)) {
            fse.removeSync(tempReportPath);
        }
        if (!fs.existsSync(tempReportPath)) {
            fse.ensureDirSync(tempReportPath);
        }
    };
    
    /** delete temporary folder with path provided */
    const deleteFolder = function (folderPath) {
        if (fs.existsSync(folderPath)) {
            fse.removeSync(folderPath);
        }
    };

    /** copy folder to be zipped in to temprary folder */
    const copyRefToTemp = function () {
        fse.emptyDirSync(tempReportPath);
        fse.copySync(envConfig.archiveReporter, tempReportPath, { overwrite: true }, err => {
            if (err) {
                console.log(':::~~error in copying to temp directory:' + err + '~~:::');
                fse.removeSync(tempReportPath);
                fse.emptyDirSync(tempReportPath);
            };
        });
    };

    /**get list of files from folderspath */
    const getFolderFilesList = function (folderPath) {
        var list = []
        fs.readdirSync(folderPath).forEach(function (file) {
            list.push(file);
        });
        return list;
    };

    /**merge JS in an HTML file to zip and mail as mail donot support .js files */
    const mergeHtmlJsContent = function (htmlContent, jsContent) {
        const { document } = (new JSDOM(htmlContent)).window;
        const element = document.getElementsByTagName('body')[0];
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.innerHTML = jsContent;
        element.appendChild(script);
        const scripElements = Array.from(document.getElementsByTagName("script"));
        scripElements.forEach(function (element) {
            const src = element.getAttribute("src");
            if (src && src.split("/")[0] === "data") {
                element.outerHTML = "";
            }
        });
        return decode("<!DOCTYPE html>" + document.documentElement.outerHTML);
    };

    /**Initialize temporary folder */
    const createTempFolder = function () {
        if (reporterName === "__mgmt-report__") {
            cleanTempFolder();
            copyRefToTemp();
            const tempReportDataPath = tempReportPath + "\\data\\";
            const tempReportHtmlPath = tempReportPath + "\\";
            const jsFile = getFolderFilesList(tempReportDataPath);
            const jsContent = fs.readFileSync(tempReportDataPath + jsFile[0], 'utf8').toString();
            const htmlContent = fs.readFileSync(tempReportHtmlPath + envConfig.archiveReportName + ".html", 'utf8').toString();
            const newContent = mergeHtmlJsContent(htmlContent, jsContent);
            fs.writeFileSync(tempReportHtmlPath + envConfig.archiveReportName + ".html", newContent);
            deleteFolder(tempReportDataPath);
        } else {
            cleanTempFolder();
            copyRefToTemp();
        }
        console.log(":::::::: Temperory report folder created :::::::::::::");
    };

    /**zipper promise response */
    const promise = new Promise(function (resolve, reject) {
        createTempFolder()
        zip.zipFolder(tempReportPath, function () {
            zip.writeToFile((envConfig.archiveReportPath + "/" + envConfig.archiveReportName + ".zip"), function (error) {
                if (!error) {
                    console.log("::::::::::::::  ✔ Zipped successfully created ::::::::::::::");
                    console.log("::::: Zip report Path - " + envConfig.archiveReportPath + "\\" + envConfig.archiveReportName + ".zip " + ":::::");
                    resolve();
                } else {
                    console.log("::::: X👮 Zip report creation failed:::::");
                    reject();
                }
                deleteFolder(tempReportPath);
            });
        });
    });
    return promise;
};

module.exports = createZipReport;
