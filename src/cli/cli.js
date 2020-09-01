#!/usr/bin/env node

const yArgs = require('yargs');
const fs = require('fs');
const yaml = require('js-yaml');
const {
    ContentChecker,
    Utils,
} = require('../lib/content-checker');

const Formatter = require('../lib/formatter');

class CLI {

    getConfig(filename) {
        return yaml.safeLoad(fs.readFileSync(filename))
    }

    getActionsDefault() {
        return [
            'checker.flesch.score',
            'checker.keyword.density',
            'checker.lsi.amount',
        ];
    }

    getConfigParameters(argv) {
        let actionIds = [];
        let keyword = "";
        let lsiKeywords = [];
        if (argv.config !== undefined) {
            const data = this.getConfig(argv.config);
            actionIds = data.actions ? data.actions : this.getActionsDefault();
            keyword = data.keyword ? data.keyword : 'NONE';
            lsiKeywords = data.lsiKeywords ? data.lsiKeywords : [];
        } else {
            actionIds = this.getActionsDefault();
            keyword = argv.keyword ? argv.keyword : 'NONE';
        }
        return [
            {
                keyword: argv.keyword ? argv.keyword : keyword,
                lsiKeywords,
            },
            Utils.getActionsFromIds(actionIds)
        ];
    }

    readSingleFile(filename) {
        if (filename === undefined)
            return console.error('[!] Please enter a filename');

        const content = fs.readFileSync(filename, {encoding: 'utf8'});

        return content
    }

    printResult(result, argv) {
        const formatter = new Formatter(result);
        if (argv.json !== undefined) {
            console.log(formatter.formatAsJSON())
        } else if (argv.junit !== undefined) {
            console.log(formatter.formatAsJUnitXML())
        } else {
            console.log(formatter.formatAsConsoleOutput())
        }
    }

    runCLI() {
        yArgs.option('config', {
            alias: 'c',
            type: 'string',
            description: 'Defines a config file that is used throughout the content check.',
        });
        yArgs.option('keyword', {
            alias: 'k',
            type: 'string',
            description: 'The keyword the content checker should look out for.'
        });
        yArgs.option('json', {
            alias: 'js',
            type: 'boolean',
            description: 'Display as json.'
        });
        yArgs.option('junit', {
            type: 'boolean',
            description: 'Outputs data in JUnit XML format for eg. Gitlab pipelines.',
        });
        yArgs
            .command('check', 'Verifies SEO integrity of the files\' content.',
                (yargs) => {
                    yArgs.option('filename', {
                        alias: 'f',
                        nargs: 1,
                    });

                }, (argv) => {
                    if (argv.filename === undefined) {
                        return console.log("Please enter at least one filename by using -f <filename>")
                    }
                    const configParameters = this.getConfigParameters(argv);
                    const params = configParameters[0];
                    let result = [];
                    if (Array.isArray(argv.filename)) {
                        for (const filename of argv.filename) {
                            params.content = this.readSingleFile(filename);
                            result.push(new ContentChecker(params, configParameters[1], filename));
                        }
                    } else {
                        params.content = this.readSingleFile(argv.filename);
                        result = new ContentChecker(params, configParameters[1], argv.filename);
                    }
                    this.printResult(result, argv);
                });

        yArgs.argv

    }
}

new CLI().runCLI()
