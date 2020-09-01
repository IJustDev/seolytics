
class Formatter {

    constructor(result) {
        this.result = result;
    }

    formatAsJSON() {
        return JSON.stringify(this.result);
    }

    formatAsConsoleOutput() {
        let formatted = "";
        this.result.map((file) => {
            formatted += "\n" + file.filename + "\n"
            file.map((c) => {
                formatted += c.name + ": " + c.result.value + "\n" + c.result.message + "\n-------\n";
            })
        });
        return formatted;
    }

    formatAsJUnitXML() {
        const testCaseAmount = this.result.length;
        let testCases = "";
        for (let testSuites of this.result) {
            for (let testCase of testSuites) {
                testCases += this.generateTestCase(testCase.filename,
                    testCase.name,
                    testCase.result.errorCode !== 0,
                    "Value: " + testCase.result.value + "; " + testCase.result.message,
                );
                testCases += "\n"
            }
        }
        let xml = `<testsuite tests="${testCaseAmount}">
    ${testCases}
</testsuite>
        `;
        return xml;
    }

    generateTestCase(filename, testname, failure, failureMessage) {
        let template =  `<testcase file="${filename}" classname="${filename}" name="${filename + " - "+ testname}">\n`;
        if (failure) {
            template += `<failure type="BadSEOException">\n${failureMessage}\n</failure>\n`
        }
        template += `</testcase>`;
        return template;
    }

}

module.exports = Formatter;
