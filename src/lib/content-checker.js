const Hypher = require('hypher');
const german = require('hyphenation.de');

module.exports.ContentChecker = class KeywordChecker {

    /**
     * @param {object} params
     */
    constructor(params, actions) {
        const results = [];
        for (const action of actions) {
            const result = action.perform(params);
            results.push({
                name: action.name(),
                result: {
                    errorCode: result[0],
                    value: result[1],
                    message: result[2],
                }
            });
        }
        return results;
    }
}

module.exports.KeywordDensityChecker = class KeywordDensityChecker {

    name() {
        return "Keyword Density";
    }

    perform(params) {
        const {content, keyword} = params;
        const density = Utils.calculateKeywordDensity(content, keyword);
        if (density > 3 || density < 1.5) {
            return [2, density, "Out of bounds. Keyword density should be between 3% and 1.5%"];
        }
        return [0, density, "Perfect!"];
    }
}

module.exports.CheckLSIKeywords = class CheckLSIKeywords {

    name() {
        return "Check LSI Keywords";
    }

    perform(params) {
        const {content, lsiKeywords} = params;
        const notIncluded = [];
        const highOccours = [];
        for (const keyword of params.lsiKeywords) {
            const occours = Utils.countOccours(content, keyword);
            if (occours === 0) {
                notIncluded.push(keyword);
                continue;
            }
            if (occours > 2) {
                highOccours.push([keyword, occours]);
            }
        }
        if (notIncluded.length > 1) {
            return [1, notIncluded, "Not all LSI-Keywords included."];
        }
        if (highOccours > 1) {
            return [1, highOccours, "Occours of LSI is high"];
        }
        return [0, null, "All keywords included"];
    }
}

module.exports.MetaDescriptionChecker = class MetaDescriptionChecker {

    name() {
        return "Meta description rating";
    }
    perform(params) {
        const {content, keyword} = params;
        if (content.length > 160 || content.length < 120) {
            return [2, content.length, "Meta description is too short or too big."];
        }
        const keywordCount = Utils.countOccours(content, keyword);
        if (keywordCount > 1) {
            return [2, keywordCount, "Keyword stuffing detected!"];
        }
        return [0, content.length, "Meta description is perfect."];
    }
}

module.exports.FleschReadingEase = class FleschReadingEase {
    name() {
        return "Flesch reading ease";
    }
    perform(params) {
        const {content} = params;
        const sentences = content.split(".");
        let wordAmount = 0;
        let syllables = 0;
        const h = new Hypher(german);
        for (const sentence of sentences) {
            const words = sentence.split(" ");
            wordAmount += words.length;
            for (const word of words) {
                syllables += this.getSyllables(word, h);
            }
        }

        const averageSentenceLength = wordAmount / sentences.length;
        const averageSyllablesPerWord = syllables / wordAmount;

        const flesch = 180 - averageSentenceLength - (58.5 * averageSyllablesPerWord);

        if (flesch < 70) {
            return [2, flesch, "Text is too hard"];
        }
        if (flesch > 100) {
            return [1, flesch, "Text is quite easy"];
        }
        return [0, flesch, "Text is perfect"];
    }

    getSyllables(word, hypher) {
        const splitted = hypher.hyphenate(word);
        return splitted.length;
    }
}

class Utils {
    static calculateKeywordDensity(content, keyword) {
        const words = content.split(" ");
        const keywordDensity = Utils.countOccours(content, keyword) / words.length;
        return keywordDensity * 100;
    }
    static countOccours(content, keyword) {
        const words = content.split(" ");
        const regex = new RegExp(keyword , "gi");
        const keywordsFound = (content.match(regex) || []).length;
        return keywordsFound;
    }
}
module.exports.Utils = Utils;
