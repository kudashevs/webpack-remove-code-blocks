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

  it('can remove a block of code marked in the lower case', () => {
    let input = 'visible /* devblock:start */ will be removed /* devblock:end */';
    let expected = 'visible';

    expect(loader.call({}, input)).toBe(expected);
  });

  it('cannot remove a block of code marked in the upper case', () => {
    let input = 'visible /* DEVBLOCK:START */ won\'t be removed /* DEVBLOCK:END */';
    let expected = 'visible /* DEVBLOCK:START */ won\'t be removed /* DEVBLOCK:END */';

    expect(loader.call({}, input)).toBe(expected);
  });
});
