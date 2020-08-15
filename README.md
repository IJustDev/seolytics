<div align="center">
<h1>Seolytics</h1>
<h3>Library for SEO analysis</h3>
</div>

<div align="center">

![npm](https://img.shields.io/npm/dw/seolytics?style=for-the-badge)

</div>

## What?
Seolytics is an library with included CLI that analysis content from a SEO point of view.

Basically it allows you to analyse a text like this:
```
# example/test.txt
Das ist ein einfacher Test.
```

with the help of this [config][config]:
```yaml
# example/seolytics.yml
keyword: "SEO"
actions:
    - checker.keyword.amount
```

and this command:
```sh
$ seolytics check example/test.txt -c example/seolytics.yml
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

## Support
<a href="https://www.buymeacoffee.com/IJustDev" target="_blank"><img src="https://bmc-cdn.nyc3.digitaloceanspaces.com/BMC-button-images/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: auto !important;width: auto !important;" ></a>

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
$ seolytics check example/test.txt -c example/seolytics.yml
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
