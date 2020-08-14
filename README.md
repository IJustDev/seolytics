# Seolytics

## What?
Seolytics is an library with inclulded CLI that verifys the SEO integrity of a certain text.
Basically it allows you to input an text like this:
```
Der Tag ist wunderschön und ich habe eine knackige rechte Arschbacke.
```

with the help of this
```javascript
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
```

Into this
```json
[
  {
    "name": "Keyword Density",
    "result": {
      "errorCode": 2,
      "value": 9.090909090909092,
      "message": "Out of bounds. Keyword density should be between 3% and 1.5%"
    }
  },
  {
    "name": "Check LSI Keywords",
    "result": {
      "errorCode": 0,
      "value": null,
      "message": "All keywords included"
    }
  },
  {
    "name": "Flesch reading ease",
    "result": {
      "errorCode": 0,
      "value": 71.625,
      "message": "Text is perfect"
    }
  }
]
```

## Current features
- check German [Flesch Reading Ease][fre]
- check keyword density
- check lsi keyword occourance
- check meta description

## Usage
```sh
$ npm i
# CLI functionality currently not implemented. Edit index.js!
$ node src/cli/index.js
```

[fre]: https://de.ryte.com/wiki/Flesch-Reading-Ease
