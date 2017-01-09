import ava from 'ava'
import { join, resolve } from 'path'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import * as mkdirp from 'mkdirp'
import { getLogger } from 'aurelia-logging'
import fixture, { fixtureDefaultOptions } from './index'

const log = getLogger('fixture:baseline:spec')
log.debug('starting fixture.baseline.spec')

const btest = fixture(ava, 'fixtures', fixtureDefaultOptions)

// d.match() uses `t` internally and when t fails, it stops
// the process instead of just throw error.
// Thus I can't catch the error with `t.throws()` and it this pass.
// Using `t` inside `match()` is desirable to benefit from `power-assert`
btest.skip('case-1', (t, d) => {
  // no api to ease read file as the actual test target should be doing it.
  const file = readFileSync(resolve(d.casePath, 'somefile.txt')).toString()

  // no api to ease write file for the same reason
  mkdirp.sync(d.resultPath)
  writeFileSync(resolve(d.resultPath, 'somefile.txt'), file)

  return d.match()
})

btest('case-pass', (t, d) => {
  // no api to ease read file as the actual test target should be doing it.
  const file = readFileSync(resolve(d.casePath, 'lorem-lpsum.txt')).toString()

  // no api to ease write file for the same reason
  mkdirp.sync(d.resultPath)
  writeFileSync(resolve(d.resultPath, 'lorem-lpsum.txt'), file)

  return d.match()
})
