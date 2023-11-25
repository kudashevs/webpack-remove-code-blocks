const testCompiler = require("./test-compiler.js");
const assert = require("assert");
const EXPECTED_OUTPUT_BASIC_CASE = `
/* this comment should not be removed */
module.exports = function addOne(num) {
    const one = 1;
    return num + one;
}`;

describe('a basic case with no options', () => {
    it('removes the appropriate block and leaves other code unchanged', async () => {
        const stats = await testCompiler('fixtures/basic-case.js', {});
        const output = stats.toJson({ source: true }).modules[0].source;

        assert.equal(output, EXPECTED_OUTPUT_BASIC_CASE);
    });
});

describe('a basic case with a string parameter', () => {
    it('removes the appropriate block and leaves other code unchanged', async () => {
        const stats = await testCompiler('fixtures/basic-case.js', {
            options: {
                blocks: ['devblock'],
            },
        });
        const output = stats.toJson({ source: true }).modules[0].source;

        assert.equal(output, EXPECTED_OUTPUT_BASIC_CASE);
    });
});

describe('a basic case with an object parameter', () => {
    it('removes the appropriate block and leaves other code unchanged', async () => {
        const stats = await testCompiler('fixtures/basic-case.js', {
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

        assert.equal(output, EXPECTED_OUTPUT_BASIC_CASE);
    });
});
