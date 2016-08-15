import { resolve } from 'path';
import test, {
  Test,
  ContextualTestContext,
  ContextualCallbackTestContext,
  Observable,
  ContextualCallbackTest,
  ContextualTest
} from 'ava';

export namespace Ava {
  export interface ContextualTestFunction {
    (name: string, run: ContextualTest): void;
    (run: ContextualTest): void;
  }

  export interface TestFunction {
    (name: string, implementation: Test): void;
    (implementation: Test): void;
  }

  export interface ContextualCallbackTestFunction {
    (name: string, run: ContextualCallbackTest): void;
    (run: ContextualCallbackTest): void;
  }

  export interface Test extends ContextualTestFunction {
    before: ContextualTestFunction;
    after: ContextualTestFunction;
    beforeEach: TestFunction;
    afterEach: TestFunction;

    skip: ContextualTestFunction;
    only: ContextualTestFunction;

    serial: ContextualTestFunction;
    failing: ContextualCallbackTestFunction;
    cb: ContextualCallbackTestFunction;
    todo(name: string): void;
  }
}

export type FixtureContextualTest = (t: ContextualTestContext, path: string) => PromiseLike<void> | Iterator<any> | Observable | void;

export type FixtureContextualSerialTest = (t: ContextualTestContext, path: string) => void;

export type FixtureContextualCallbackTest = (t: ContextualCallbackTestContext, path: string) => void;

export interface BeforeRunner {
  (title: string, run: Test): void;
  (run: Test): void;
  skip: FixtureRunner;
  cb: FixtureCallbackRunner;
}

export interface AfterRunner extends BeforeRunner {
  always: BeforeRunner;
}

export interface FixtureContextualTestFunction {
  (title: string, fixtureName: string, run: FixtureContextualTest): void;
  (fixtureName: string, run: FixtureContextualTest): void;
}

export interface FixtureContextualSerialTestFunction {
  (title: string, fixtureName: string, run: FixtureContextualSerialTest): void;
  (fixtureName: string, run: FixtureContextualSerialTest): void;
}

export interface FixtureContextualCallbackTestFunction {
  (title: string, fixtureName: string, run: FixtureContextualCallbackTest): void;
  (fixtureName: string, run: FixtureContextualCallbackTest): void;
}

export interface FixtureRunner extends FixtureContextualTestFunction {
  skip: FixtureRunner;
  cb: FixtureCallbackRunner;
}

export interface FixtureCallbackRunner extends FixtureContextualTestFunction {
  cb: FixtureCallbackRunner;
}



export interface FixtureTest extends FixtureContextualTestFunction {

  // before, after, beforeEach, afterEach, skip, only
  before: BeforeRunner;

  serial: FixtureContextualSerialTestFunction;

  failing: FixtureContextualCallbackTestFunction;

  cb: FixtureContextualCallbackTestFunction;

  todo(title: string): void;

  only(title: string, fixtureName: string, run: (t: ContextualTestContext, path: string) => any): void;
  only(fixtureName: string, run: (t: ContextualTestContext, path: string) => any): void;

  skip(title: string, fixtureName: string, run: (t: ContextualTestContext, path: string) => any): void;
  skip(fixtureName: string, run: (t: ContextualTestContext, path: string) => any): void;

  after(title: string, run: (t: ContextualTestContext) => void): void;
  after(run: (t: ContextualTestContext) => void): void;

  beforeEach(title: string, run: (t: ContextualTestContext) => void): void;
  beforeEach(run: (t: ContextualTestContext) => void): void;

  afterEach(title: string, run: (t: ContextualTestContext) => void): void;
  afterEach(run: (t: ContextualTestContext) => void): void;
}

/**
 * Creates fixture test.
 * `cwd` is set to the case directory during the test.
 * @param ava The ava module function (`import ava from 'ava'`).
 * @param path Absolute or relative path to the fixture cases parent directory.
 */
export default function fixture(ava: typeof test, path: string): FixtureTest {
  function curry<T>(testfn: (name: string, run: any) => any): T {
    return (
      /**
       * Runs a fixture test.
       * @param [title] Title of the test (for display and filtering).
       * @param caseName: Name of the test case, matching the folder under `path`.
       * @param run: The test function.
       */
      (
        title: string,
        caseName: string,
        run: (t: ContextualTestContext, path: string) => any
      ) => {
        if (!run) {
          // name is optional
          run = caseName as any;
          caseName = title;
        }

        const fixturePath = resolve(path, caseName);
        return testfn(`${title ? title + ' ' : ''}(fixture: ${caseName})`, (t: any) => {
          let result: any;
          const cwd = process.cwd();
          try {
            process.chdir(fixturePath)
            result = run(t, fixturePath);
            if (result && result.then) {
              return result.then((r: any) => {
                process.chdir(cwd);
                return r;
              })
            }
          }
          finally {
            process.chdir(cwd)
          }
        });
      }) as any;
  }

  let fn = curry<FixtureContextualTestFunction>(ava);

  let others = {
    only: curry<FixtureContextualTestFunction>(ava.only),
    skip: curry<FixtureContextualTestFunction>(ava.skip),
    serial: curry<FixtureContextualSerialTestFunction>(ava.serial),
    todo: ava.todo,
    cb: curry<FixtureContextualCallbackTestFunction>(ava.cb),
    failing: curry<FixtureContextualCallbackTestFunction>(ava.failing),
    before: ava.before,
    beforeEach: ava.beforeEach,
    after: ava.after,
    afterEach: ava.afterEach
  };

  for (let key in others) {
    (fn as any)[key] = (others as any)[key];
  }

  return fn as FixtureTest; // fn as typeof fn & typeof others;
}
