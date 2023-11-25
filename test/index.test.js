const assert = require('assert');

describe('a test case with different letter cases', () => {
  const testLoader = require('../src/index');
  const assertions = [
    {
      input: `visible /* devblock:start */ will be removed /* devblock:end */`,
      result: 'visible',
    },
    {
      input: `visible /* DEVBLOCK:START */ won't be removed /* DEVBLOCK:END */`,
      result: `visible /* DEVBLOCK:START */ won't be removed /* DEVBLOCK:END */`,
    },
  ];

  assertions.forEach(({ input, result }) => {
    it(`called with ${input} and should return expected`, () => {
      assert.equal(testLoader.call({}, input), result);
    });
  });
});
