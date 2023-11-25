const assert = require('assert');

describe('a default test suite', () => {
  const loader = require('../src/index');

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
