const compiler = require('./test-compiler.js');
const assert = require('assert');

describe('test suite for the inline case', () => {
  const EXPECTED_OUTPUT_INLINE_CASE = `console.log('User was created ' + user.name + ' ' + user.age);`;

  describe('an inline case with a string parameter', () => {
    it('can remove the marked block and leave other code unchanged', async () => {
      const stats = await compiler('fixtures/inline-case.js', {
        options: {
          blocks: ['dev'],
        },
      });
      const output = stats.toJson({ source: true }).modules[0].source;

      assert.equal(output, EXPECTED_OUTPUT_INLINE_CASE);
    });
  });

  describe('an inline case with an object parameter', () => {
    it('can remove the marked block and leave other code unchanged', async () => {
      const stats = await compiler('fixtures/inline-case.js', {
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
});
