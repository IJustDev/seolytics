# Changelog

## [1.1.0] - 2020-09-01
### Added
- JUnit test report format
- [Formatter class](src/lib/formatter.js)
- Multiple files are now accepted as input (But they need to be passed in via the `-f` flag.)
### Removed
- `seolytics check <filename>` does not work anymore. You now need to pass the filename like this: `seolytics check -f filename`

## [0.1.0] - 2020-08-14
### Added
- initial commit
- [content-checker.js](./src/lib/content-checker.js)
- KeywordDensityChecker
- CheckLSIKeywords
- FleschReadingEase
- MetaDescriptionChecker
- [index.js](./src/cli/index.js) with basic usage
