const { getOptions } = require('loader-utils');

jest.mock('loader-utils');

describe('default test suite', () => {
  const loader = require('../src/index');
  const originalMode = process.env.NODE_ENV;

  it.each([
    ['production', '/* devblock:start */ any /* devblock:end */', ''],
    ['test', '/* devblock:start */ any /* devblock:end */', ''],
  ])('can proceed in %s environment', (environment, input, expected) => {
    process.env.NODE_ENV = environment;

    expect(process.env.NODE_ENV).toBe(environment);
    expect(loader.call({}, input)).toBe(expected);

    process.env.NODE_ENV = originalMode;
  });

  it.each([
    ['development', '/* devblock:start */ any /* devblock:end */', '/* devblock:start */ any /* devblock:end */'],
  ])('can skip in %s environment', (environment, input, expected) => {
    process.env.NODE_ENV = environment;

    expect(process.env.NODE_ENV).toBe(environment);
    expect(loader.call({}, input)).toBe(expected);

    process.env.NODE_ENV = originalMode;
  });

  it('can remove a code block marked through the colon by default', () => {
    let input = 'visible /* devblock:start */ will be removed /* devblock:end */';
    let expected = 'visible ';

    expect(loader.call({}, input)).toBe(expected);
  });

  it('can remove a code block marked through the underscore', () => {
    getOptions.mockReturnValueOnce({
      blocks: [
        {
          start: 'devblock_start',
          end: 'devblock_end',
          prefix: '/*',
          suffix: '*/',
        },
      ],
    });
    let input = 'visible /* devblock_start */ will be removed /* devblock_end */';
    let expected = 'visible ';

    expect(loader.call({}, input)).toBe(expected);
  });

  it('can use special characters in labels', () => {
    getOptions.mockReturnValueOnce({
      blocks: [
        {
          start: '*devblock:start!',
          end: '*devblock:end$',
          prefix: '<!--',
          suffix: '-->',
        },
      ],
    });
    let input = 'visible <!-- *devblock:start! --> will be removed <!-- *devblock:end$ -->';
    let expected = 'visible ';

    expect(loader.call({}, input)).toBe(expected);
  })

  it('can remove a code block marked in lower case', () => {
    let input = 'visible /* devblock:start */ will be removed /* devblock:end */';
    let expected = 'visible ';

    expect(loader.call({}, input)).toBe(expected);
  });

  it('cannot remove a code block marked in upper case', () => {
    let input = 'visible /* DEVBLOCK:START */ won\'t be removed /* DEVBLOCK:END */';
    let expected = 'visible /* DEVBLOCK:START */ won\'t be removed /* DEVBLOCK:END */';

    expect(loader.call({}, input)).toBe(expected);
  });
});
