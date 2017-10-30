# ava-fixture

[![Greenkeeper badge](https://badges.greenkeeper.io/unional/ava-fixture.svg)](https://greenkeeper.io/)

[![stable][stable-image]][stable-url]
[![NPM version][npm-image]][npm-url]
[![NPM downloads][downloads-image]][downloads-url]
[![Build status][travis-image]][travis-url]
[![Coverage Status][coveralls-image]][coveralls-url]

This library helps you to write fixture tests: test-per-folder or test-per-file.

## Usage

For example, you are testing code that process files (e.g. a compiler, config-reader, etc).

You put each test case inside its own folder:

```sh
+ fixtures
  + cases
    + empty
      - somefiles
    + basic-case
      - someOtherFiles
    + single-line
      - ...
    + ...
```

You can run each test case like this:

```ts
import ava from 'ava';
import fixture from 'ava-fixture';

// Point to the base folder which contain the fixtures.
// Use relative path starts from project root or absolute path
const ftest = fixture(ava, 'fixtures/cases', 'fixtures/baselines', 'fixtures/results');

ftest.each((t, d) => {
  // d.caseName: 'empty', 'basic-case', 'single-line', etc
  // d.casePath: absolute path points to each test case folder
  // d.resultPath: absolute path points to each test result folder

  // Your test target reads from `d.casePath` and writes to `d.resultPath`
  target.process(d.casePath, d.resultPath)

  // d.match() will compare the result folder against the baseline folder
  return d.match()
})
```

You can also use this library to run tests that only read files:

```ts
import ava from 'ava';
import fixture from 'ava-fixture';

// Point to the base folder which contain the fixtures.
// Relative path starts from project root.
const ftest = fixture(ava, 'fixture/cases');

ftest('test title', 'case-1', (t, d) => {
  // t is ava test assertion.
  t.is(d.casePath, 'absolut path the the case folder')

  const result = target.read(d.casePath)

  t.deepEqual(result, 'expected result')
});

// test title can be omitted
ftest('case-1', (t, d) => {
  // ...
})

// go through each test
ftest.each((t, d) => {
  // ...
})

// or run certain test based on filter
ftest.each(/some filter/, (t, d) => {
  // ...
})
```

## Other API

```ts
import test from 'ava';
import fixture from 'ava-fixture';

const ftest = fixture(test, 'fixture/cases');

ftest.only(...)
ftest.skip(...)
ftest.failing(...)
ftest.only.each.failing(...)
```

For `before()`, `beforeEach()`, `after()`, `afterEach()`, `todo()`, use `ava` directly.

## Contribute

```sh
# right after clone
npm install

# begin making changes
git checkout -b <branch>
npm run watch

# edit `webpack.config.es5.js` and `rollup.config.es2015.js` to exclude dependencies for the bundle if needed

# after making change(s)
git commit -m "<commit message>"
git push

# create PR
```

## Npm Commands

There are a few useful commands you can use during development.

```sh
# Run tests (and lint) automatically whenever you save a file.
npm run watch

# Run tests with coverage stats (but won't fail you if coverage does not meet criteria)
npm run test

# Manually verify the project.
# This will be ran during 'npm preversion' so you normally don't need to run this yourself.
npm run verify

# Build the project.
# You normally don't need to do this.
npm run build

# Run tslint
# You normally don't need to do this as `npm run watch` and `npm version` will automatically run lint for you.
npm run lint
```

Generated by [`generator-unional@0.9.0`](https://github.com/unional/unional-cli)

[stable-image]: http://badges.github.io/stability-badges/dist/stable.svg
[stable-url]: http://github.com/badges/stability-badges
[npm-image]: https://img.shields.io/npm/v/ava-fixture.svg?style=flat
[npm-url]: https://npmjs.org/package/ava-fixture
[downloads-image]: https://img.shields.io/npm/dm/ava-fixture.svg?style=flat
[downloads-url]: https://npmjs.org/package/ava-fixture
[travis-image]: https://img.shields.io/travis/unional/ava-fixture.svg?style=flat
[travis-url]: https://travis-ci.org/unional/ava-fixture.svg?branch=master
[coveralls-image]: https://coveralls.io/repos/github/unional/ava-fixture/badge.svg
[coveralls-url]: https://coveralls.io/github/unional/ava-fixture
