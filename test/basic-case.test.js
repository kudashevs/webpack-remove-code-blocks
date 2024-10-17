const compiler = require('./helpers/compiler.js');

describe('test suite for the simple/basic case', () => {
  const EXPECTED_OUTPUT = `/* this comment should not be removed */
module.exports = function addOne(num) {
    const one = 1;
    return num + one;
}`;

  describe('a basic case used with no options', () => {
    it('can remove the marked block and leave other code unchanged', async () => {
      const stats = await compiler('basic-case', {});
      const output = stats.toJson({ source: true }).modules[0].source;

      expect(output).toBe(EXPECTED_OUTPUT);
    });
  });

  describe('a basic case used with a string parameter', () => {
    it('can remove the marked block and leave other code unchanged', async () => {
      const stats = await compiler('basic-case', {
        options: {
          blocks: ['devblock'],
        },
      });
      const output = stats.toJson({ source: true }).modules[0].source;

      expect(output).toBe(EXPECTED_OUTPUT);
    });
  });

  describe('a basic case used with an object parameter', () => {
    it('can remove the marked block and leave other code unchanged', async () => {
      const stats = await compiler('basic-case', {
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

      expect(output).toBe(EXPECTED_OUTPUT);
    });
  });
});
