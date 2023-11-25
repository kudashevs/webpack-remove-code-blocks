const testCompiler = require('./test-compiler.js');
const assert = require('assert');

describe('a test case with different letter cases', () => {
  const testLoader = require('../src/index');
  const assertions = [
    {
      input: `visible /* devblock:start */ will be removed /* devblock:end */`,
      result: 'visible',
    },
    {
      input: `visible /* DEVBLOCK:START */ won't be removed /* DEVBLOCK:END */`,
      result: `visible /* DEVBLOCK:START */ won't be removed /* DEVBLOCK:END */`,
    },
  ];

  assertions.forEach(({ input, result }) => {
    it(`called with ${input} and should return expected`, () => {
      assert.equal(testLoader.call({}, input), result);
    });
  });
});

const EXPECTED_OUTPUT_INLINE_CASE = `console.log('User was created ' + user.name + ' ' + user.age);`;

describe('an inline case with a string parameter', () => {
  it('removes the appropriate block and leaves other code unchanged', async () => {
    const stats = await testCompiler('fixtures/inline-case.js', {
      options: {
        blocks: ['dev'],
      },
    });
    const output = stats.toJson({ source: true }).modules[0].source;

    assert.equal(output, EXPECTED_OUTPUT_INLINE_CASE);
  });
});

describe('an inline case with an object parameter', () => {
  it('removes the appropriate block and leaves other code unchanged', async () => {
    const stats = await testCompiler('fixtures/inline-case.js', {
      options: {
        blocks: [
          {
            start: 'dev:start',
            end: 'dev:end',
            prefix: '/*',
            suffix: '*/',
          },
        ],
      },
    });
    const output = stats.toJson({ source: true }).modules[0].source;

    assert.equal(output, EXPECTED_OUTPUT_INLINE_CASE);
  });
});

const EXPECTED_OUTPUT_BASIC_CASE = `
/* this comment should not be removed */
module.exports = function addOne(num) {
    const one = 1;
    return num + one;
}`;

describe('a basic case with no options', () => {
  it('removes the appropriate block and leaves other code unchanged', async () => {
    const stats = await testCompiler('fixtures/basic-case.js', {});
    const output = stats.toJson({ source: true }).modules[0].source;

    assert.equal(output, EXPECTED_OUTPUT_BASIC_CASE);
  });
});

describe('a basic case with a string parameter', () => {
  it('removes the appropriate block and leaves other code unchanged', async () => {
    const stats = await testCompiler('fixtures/basic-case.js', {
      options: {
        blocks: ['devblock'],
      },
    });
    const output = stats.toJson({ source: true }).modules[0].source;

    assert.equal(output, EXPECTED_OUTPUT_BASIC_CASE);
  });
});

describe('a basic case with an object parameter', () => {
  it('removes the appropriate block and leaves other code unchanged', async () => {
    const stats = await testCompiler('fixtures/basic-case.js', {
      options: {
        blocks: [
          {
            start: 'devblock:start',
            end: 'devblock:end',
            prefix: '/*',
            suffix: '*/',
          },
        ],
      },
    });
    const output = stats.toJson({ source: true }).modules[0].source;

    assert.equal(output, EXPECTED_OUTPUT_BASIC_CASE);
  });
});

const EXPECTED_OUTPUT_COMPLEX_CASE = `
/* this comment should not be removed */
app.post('/update/:id', async (req, res) => {
    const id = req.params.id;
    const record = await repo.update(id, req.body);

    _logServer.log(id, record, req.params);

    res.send('Record Updated')
})`;

describe('a complex case with a string parameter and an object parameter', () => {
  it('removes the appropriate block and leaves other code unchanged', async () => {
    const stats = await testCompiler('fixtures/complex-case.js', {
      options: {
        blocks: [
          'info',
          {
            start: 'stage_only_start',
            end: 'stage_only_stop',
            prefix: '/*',
            suffix: '*/',
          },
        ],
      },
    });
    const output = stats.toJson({ source: true }).modules[0].source;

    assert.equal(output, EXPECTED_OUTPUT_COMPLEX_CASE);
  });
});

const EXPECTED_OUTPUT_COMPOUND_CASE = `
var makeFoo = function(bar, baz) {
    // The following code will be removed with the loader


    // This code will remain
    return new Foo(bar, baz);
}`;

describe('a compound case from the README.md file', () => {
  it('removes the appropriate block and leaves other code unchanged', async () => {
    const stats = await testCompiler('fixtures/compound-case', {
      options: {
        blocks: [
          'debug',
          'devblock',
          {
            start: 'devblock_start',
            end: 'devblock_end',
            prefix: '/*',
            suffix: '*/',
          },
        ],
      },
    });
    const output = stats.toJson({ source: true }).modules[0].source;

    assert.equal(output, EXPECTED_OUTPUT_COMPOUND_CASE);
  });
});
