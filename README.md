# Seolytics

## What?
Seolytics is an library with inclulded CLI that verifys the SEO integrity of a certain text.

Basically it allows you to analyse a text like this:
```
Das ist ein einfacher Test.
```

with the help of this [config][config]:
```
keyword: "SEO"
actions:
    - checker.keyword.amount
```

And get an analysis like this:
```json
[
  {
    "name": "Flesch reading ease",
    "result": {
      "errorCode": 0,
      "value": 99,
      "message": "Text is perfect"
    }
  },
  {
    "name": "Keyword Density",
    "result": {
      "errorCode": 2,
      "value": 0,
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
  }
]
```

## Installation
```sh
$ npm i -g seolytics
```

## CLI Usage
```sh
$ seolytics --help
```

```
seolytics [command]

Commands:
  seolytics check [filename]  Verifies SEO integrity of the files' content.

Options:
  --help         Show help                                             [boolean]
  --version      Show version number                                   [boolean]
  --config, -c   Defines a config file that is used throughout the content
                 check.                                                 [string]
  --keyword, -k  The keyword the content checker should look out for.   [string]
```

```sh
$ seolytics check test.txt -c seolytics.yml
```

### Actions
Actions are certain functions that can be called to determine the SEO rating of your content.

You can define these actions in your config (check the [example config][example-config])

```
checker.keyword.density
checker.keyword.amount
checker.lsi.amount
checker.meta.validity
checker.flesch.score
counter.words
counter.sentences
counter.chars
```

## Getting started
If you want to create your own action or your own cli, here is a sample Getting started snippet.

```javascript
// index.js
const {
    ContentChecker,
    FleschReadingEase,
} = require('seolytics');

const content = 'Das ist ein einfacher Test';

const actions = [
    new FleschReadingEase(),
];

const params = {
    content,
    keyword: 'Test',
    lsiKeywords: ['einfacher']
}

const kwchecker = new ContentChecker(params, actions);

console.log(JSON.stringify(kwchecker));
```

Run it with

```sh
$ node index.js
```

and expect following output

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


[fre]: https://de.ryte.com/wiki/Flesch-Reading-Ease
[config]: ./example/seolytics.yml
