const testCompiler = require("./test-compiler.js");
const assert = require("assert");
const EXPECTED_OUTPUT_INLINE_CASE = `console.log('User was created ' + user.name + ' ' + user.age);`;

describe('an inline case with a string parameter', () => {
    it('removes the appropriate block and leaves other code unchanged', async () => {
        const stats = await testCompiler('fixtures/inline-case.js', {
            options: {
                blocks: ['dev'],
            },
        });
        const output = stats.toJson({ source: true }).modules[0].source;

        assert.equal(output, EXPECTED_OUTPUT_INLINE_CASE);
    });
});

describe('an inline case with an object parameter', () => {
    it('removes the appropriate block and leaves other code unchanged', async () => {
        const stats = await testCompiler('fixtures/inline-case.js', {
            options: {
                blocks: [
                    {
                        start: 'dev:start',
                        end: 'dev:end',
                        prefix: '/*',
                        suffix: '*/',
                    },
                ],
            },
        });
        const output = stats.toJson({ source: true }).modules[0].source;

        assert.equal(output, EXPECTED_OUTPUT_INLINE_CASE);
    });
});

