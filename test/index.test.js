const assert = require('assert');

describe('default test suite', () => {
  const loader = require('../src/index');
  const originalMode = process.env.NODE_ENV;

  it('can proceed on production environment', () => {
    process.env.NODE_ENV = 'production';

    let input = '/* devblock:start */ visible /* devblock:end */';
    let expected = '';

    assert.equal(loader.call({}, input), expected);

    process.env.NODE_ENV = originalMode;
  });

  it('can skip on development environment', () => {
    process.env.NODE_ENV = 'development';

    let input = '/* devblock:start */ visible /* devblock:end */';
    let expected = '/* devblock:start */ visible /* devblock:end */';

    assert.equal(loader.call({}, input), expected);

    process.env.NODE_ENV = originalMode;
  });

  it('can remove a block of code marked in the lower case', () => {
    let input = 'visible /* devblock:start */ will be removed /* devblock:end */';
    let expected = 'visible';

    assert.equal(loader.call({}, input), expected);
  })

  it('cannot remove a block of code marked in the upper case', () => {
    let input = 'visible /* DEVBLOCK:START */ won\'t be removed /* DEVBLOCK:END */';
    let expected = 'visible /* DEVBLOCK:START */ won\'t be removed /* DEVBLOCK:END */';

    assert.equal(loader.call({}, input), expected);
  })
});
