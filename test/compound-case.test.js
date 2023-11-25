const testCompiler = require('./test-compiler.js');
const assert = require('assert');

describe('test suite for the compound case', () => {
  const EXPECTED_OUTPUT_COMPOUND_CASE = `
var makeFoo = function(bar, baz) {
    // The following code will be removed with the loader


    // This code will remain
    return new Foo(bar, baz);
}`;

  describe('a compound case from the README.md file', () => {
    it('can remove the marked block and leave other code unchanged', async () => {
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
});
