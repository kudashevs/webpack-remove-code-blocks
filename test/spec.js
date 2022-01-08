const testCompiler = require('./test-compiler.js');
const assert = require('assert');

const EXPECTED_OUTPUT_BASIC_CASE = `
/* this comment should not be removed */
module.exports = function addOne(num) {
    const one = 1;
    return num + one;
}`;

describe('basic case with a string parameter', () => {
    it('removes the appropriate block and leaves other code unchanged', async () => {
        const stats = await testCompiler('fixtures/basic-case.js', {
            options: {
                'blocks': [
                    'develblock'
                ]
            }
        });
        const output = stats.toJson().modules[0].source;

        assert.equal(output, EXPECTED_OUTPUT_BASIC_CASE);
    });
});

describe('basic case with an object parameter', () => {
    it('removes the appropriate block and leaves other code unchanged', async () => {
        const stats = await testCompiler('fixtures/basic-case.js', {
            options: {
                'blocks': [
                    {
                        start: 'develblock:start',
                        end: 'develblock:end',
                        prefix: '/*',
                        suffix: '*/'
                    }]
            }
        });
        const output = stats.toJson().modules[0].source;

        assert.equal(output, EXPECTED_OUTPUT_BASIC_CASE);
    });
});
