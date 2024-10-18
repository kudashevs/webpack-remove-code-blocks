const compiler = require('./helpers/compiler.js');

describe('test suite for the inline case', () => {
  const EXPECTED_OUTPUT = `/* this comment should not be removed */
let fizzBuzz = function (n) {
  let result = '';
  for (i = 1; i <= n; i++) {
    if (i % 15 === 0) {
      result += "FizzBuzz\\n";
    } else if (i % 3 === 0) {
      result += "Fizz\\n";
    } else if (i % 5 === 0) {
      result += "Buzz\\n";
    } else {
      result += i.toString() + "\\n";
    }
  }

  return result;
};`;

  describe('a repeated case with a string parameter', () => {
    it('can remove the marked block and leave other code unchanged', async () => {
      const stats = await compiler('multi-line-repeated', {
        options: {
          blocks: ['dev'],
        },
      });
      const output = stats.toJson({ source: true }).modules[0].source;

      expect(output).toBe(EXPECTED_OUTPUT);
    });
  });

  describe('an inline case with an object parameter', () => {
    it('can remove the marked block and leave other code unchanged', async () => {
      const stats = await compiler('multi-line-repeated', {
        options: {
          blocks: [
            {
              start: 'dev:start',
              end: 'dev:end',
              prefix: '/*',
              suffix: '*/',
              keepspace: false,
            },
          ],
        },
      });
      const output = stats.toJson({ source: true }).modules[0].source;

      expect(output).toBe(EXPECTED_OUTPUT);
    });
  });
});
