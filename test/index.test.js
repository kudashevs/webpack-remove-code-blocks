const { getOptions } = require('loader-utils');

jest.mock('loader-utils');

describe('default test suite', () => {
  const loader = require('../src/index');
  const originalMode = process.env.NODE_ENV;

  it('can proceed in production environment', () => {
    process.env.NODE_ENV = 'production';

    let input = '/* devblock:start */ visible /* devblock:end */';
    let expected = '';

    expect(process.env.NODE_ENV).toBe('production');
    expect(loader.call({}, input)).toBe(expected);

    process.env.NODE_ENV = originalMode;
  });

  it('can proceed in test environment', () => {
    process.env.NODE_ENV = 'test';

    let input = '/* devblock:start */ visible /* devblock:end */';
    let expected = '';

    expect(process.env.NODE_ENV).toBe('test');
    expect(loader.call({}, input)).toBe(expected);

    process.env.NODE_ENV = originalMode;
  });

  it('can skip in development environment', () => {
    process.env.NODE_ENV = 'development';

    let input = '/* devblock:start */ visible /* devblock:end */';
    let expected = '/* devblock:start */ visible /* devblock:end */';

    expect(process.env.NODE_ENV).toBe('development');
    expect(loader.call({}, input)).toBe(expected);

    process.env.NODE_ENV = originalMode;
  });

  it('can remove a code block marked through the colon', () => {
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
