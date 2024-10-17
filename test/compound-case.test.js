const compiler = require('./helpers/compiler.js');

describe('test suite for the compound case', () => {
  const EXPECTED_OUTPUT = `
var makeFoo = function(bar, baz) {
    // The following code will be removed with the loader


    // This code will remain
    return new Foo(bar, baz);
}`;

  describe('a compound case from the README.md file', () => {
    it('can remove the marked block and leave other code unchanged', async () => {
      const stats = await compiler('compound-case', {
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

      expect(output).toBe(EXPECTED_OUTPUT);
    });
  });
});
