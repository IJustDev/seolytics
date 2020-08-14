const fs = require('fs');
const {
    ContentChecker,
    KeywordDensityChecker,
    FleschReadingEase,
    CheckLSIKeywords,
    MeteaDescriptionChecker,
} = require('seolytics');

require('yargs')
    .command('check [filename]', 'Verifies SEO integrity of the files\' content.', (yargs) => {
        yargs.positional('filename', {
            describe: 'Name of the file that you want to be checked',
        });
    }, (argv) => {
        const filename = argv.filename;
        if (filename === undefined) {
            console.error('[!] Please enter a filename');
            return;
        }
        const content = fs.readFileSync(filename, {encoding: 'utf8'});
        const actions = [
            new KeywordDensitiyChecker(),
            new CheckLSIKeywords(),
            new FleschReadingEase(),
        ];
        const params = {
            content,
            keyword: argv.keyword || 'UNDEFINED',
            lsiKeywords: [],
        };
        const kwchecker = new ContentChecker(params, actions);
        console.log(JSON.stringify(kwchecker));
    })
    .option('config', {
        alias: 'c',
        type: 'string',
        description: 'Defines a config file that is used throughout the content check.',
    })
    .option('keyword', {
        alias: 'k'
        type: 'string',
        description: 'The keyword the content checker should look out for.'
    })
    .argv
