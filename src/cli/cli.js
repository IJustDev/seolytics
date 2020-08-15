#!/usr/bin/env node

const fs = require('fs');
const yaml = require('js-yaml');
const {
    ContentChecker,
    Utils,
} = require('../lib/content-checker');

function getConfig(filename) {
    return yaml.safeLoad(fs.readFileSync(filename))
}

function getActionsDefault() {
    return [
        'checker.flesch.score',
        'checker.keyword.density',
        'checker.lsi.amount',
    ];
}

function getConfigParameters(argv) {
    let actionIds = [];
    let keyword = "";
    let lsiKeywords = [];
    if (argv.config !== undefined) {
        const data = getConfig(argv.config);
        actionIds = data.actions ? data.actions : getActionsDefault();
        keyword = data.keyword ? data.keyword : 'NONE';
        lsiKeywords = data.lsiKeywords ? data.lsiKeywords : [];
    } else {
        actionIds = getActionsDefault();
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

require('yargs')
    .command('check [filename]', 'Verifies SEO integrity of the files\' content.', (yargs) => {
        yargs.positional('filename', {
            describe: 'Name of the file that you want to be checked',
        });
    }, (argv) => {
        const filename = argv.filename;
        if (filename === undefined)
            return console.error('[!] Please enter a filename');

        const content = fs.readFileSync(filename, {encoding: 'utf8'});

        const configParameters = getConfigParameters(argv);
        let params = configParameters[0];
        params.content = content;

        console.log(JSON.stringify(new ContentChecker(params, configParameters[1])));
    })
    .option('config', {
        alias: 'c',
        type: 'string',
        description: 'Defines a config file that is used throughout the content check.',
    })
    .option('keyword', {
        alias: 'k',
        type: 'string',
        description: 'The keyword the content checker should look out for.'
    })
    .argv
