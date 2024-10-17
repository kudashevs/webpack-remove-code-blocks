const { getOptions } = require('loader-utils');
const compiler = require('./helpers/compiler.js');
const converter = require('./helpers/converter');

jest.mock('loader-utils');

describe('replacement test suite', () => {
  const loader = require('../src/index');

  it('can apply a single-line replacement', () => {
    getOptions.mockReturnValueOnce({
      blocks: [
        {
          start: 'devblock:start',
          end: 'devblock:end',
          prefix: '/*',
          suffix: '*/',
          replacement: '<!-- removed -->',
        },
      ],
    });
    let input = 'visible /* devblock:start */ will be removed /* devblock:end */';
    let expected = 'visible<!-- removed -->';

    expect(loader.call({}, input)).toBe(expected);
  });

  it('can apply a multi-line replacement', async () => {
    const EXPECTED_OUTPUT = `/* this comment should not be removed */
module.exports = function addOne(num) {
    const one = 1;
    <!-- deleted -->
    return num + one;
}`;

    getOptions.mockReturnValueOnce({
      blocks: [
        {
          start: 'devblock:start',
          end: 'devblock:end',
          prefix: '/*',
          suffix: '*/',
          replacement: '<!-- deleted -->',
        },
      ],
    });

    const stats = await compiler('multi-line-basic');
    const output = stats.toJson({ source: true }).modules[0].source;

    expect(converter(output)).toBe(converter(EXPECTED_OUTPUT));
  });
});
