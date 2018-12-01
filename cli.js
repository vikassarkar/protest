#!/usr/bin/env node --harmony

const path = require("path");
const moduleDetails = require("./package.json");
const program = require('commander'); // for reading command line
const test = require('./src/process/test');
program
    .arguments('<cmd>')
    .option("", "help", console.log("protest ver-" + moduleDetails.version))
    .action(function (cmd) {
        const filename = process.argv.slice(2)[1];
        const filePath = path.resolve(process.cwd(), filename);
        const protestPath = path.join(__dirname, "./");
        const envconfig = require(filePath).envconfig;
        if (cmd) {
            switch (cmd) {
                case "v":
                case "version":
                    console.log("protest ver-" + moduleDetails.version)
                    break;
                case "help":
                    console.log(moduleDetails.version);
                    break;
                case "test":
                    test(protestPath,filePath, envconfig);
                    break;
            }
        } else {
            console.log("provide command to execute")
        }

    })
    .parse(process.argv);

