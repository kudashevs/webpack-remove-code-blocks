const compiler = require('./test-compiler.js');
const assert = require('assert');

describe('a test suite for the simple/basic case', () => {
  const EXPECTED_OUTPUT_BASIC_CASE = `
/* this comment should not be removed */
module.exports = function addOne(num) {
    const one = 1;
    return num + one;
}`;

  describe('a basic case used with no options', () => {
    it('can remove the marked block and leave other code unchanged', async () => {
      const stats = await compiler('fixtures/basic-case.js', {});
      const output = stats.toJson({ source: true }).modules[0].source;

      assert.equal(output, EXPECTED_OUTPUT_BASIC_CASE);
    });
  });

  describe('a basic case used with a string parameter', () => {
    it('can remove the marked block and leave other code unchanged', async () => {
      const stats = await compiler('fixtures/basic-case.js', {
        options: {
          blocks: ['devblock'],
        },
      });
      const output = stats.toJson({ source: true }).modules[0].source;

      assert.equal(output, EXPECTED_OUTPUT_BASIC_CASE);
    });
  });

  describe('a basic case used with an object parameter', () => {
    it('can remove the marked block and leave other code unchanged', async () => {
      const stats = await compiler('fixtures/basic-case.js', {
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
});
