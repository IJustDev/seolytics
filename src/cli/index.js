const {
    ContentChecker,
    KeywordDensityChecker,
    FleschReadingEase,
    CheckLSIKeywords,
    MeteaDescriptionChecker,
} = require('../lib/content-checker');

const content = `Der Tag ist wunderschön und ich habe eine knackige rechte Arschbacke.`;

const actions = [
    new KeywordDensityChecker(),
    new CheckLSIKeywords(),
    new FleschReadingEase(),
];

const params = {
    content,
    keyword: 'Arschbacke',
    lsiKeywords: ['wunderschön']
}

const kwchecker = new ContentChecker(params, actions);

console.log(JSON.stringify(kwchecker));
