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
        const output = stats.toJson({ source: true }).modules[0].source;

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
        const output = stats.toJson({ source: true }).modules[0].source;

        assert.equal(output, EXPECTED_OUTPUT_BASIC_CASE);
    });
});

const EXPECTED_OUTPUT_COMPLEX_CASE = `
/* this comment should not be removed */
app.post('/update/:id', async (req, res) => {
    const id = req.params.id;
    const record = await repo.update(id, req.body);

    _logServer.log(id, record, req.params);

    res.send('Record Updated')
})`;

describe('complex case with a string parameter and an object parameter', () => {
    it('removes the appropriate block and leaves other code unchanged', async () => {
        const stats = await testCompiler('fixtures/complex-case.js', {
            options: {
                'blocks': [
                    'info',
                    {
                        start: 'stage_only_start',
                        end: 'stage_only_stop',
                        prefix: '/*',
                        suffix: '*/'
                    }]
            }
        });
        const output = stats.toJson({ source: true }).modules[0].source;

        assert.equal(output, EXPECTED_OUTPUT_COMPLEX_CASE);
    });
});

const EXPECTED_OUTPUT_COMPOUND_CASE = `
var makeFoo = function(bar, baz) {
    // The following code will be removed with the loader


    // This code will remain
    return new Foo(bar, baz);
}`;

describe('compound case from the README.md file', () => {
    it('removes the appropriate block and leaves other code unchanged', async () => {
        const stats = await testCompiler('fixtures/compound-case', {
            options: {
                'blocks': [
                    'debug',
                    'devblock',
                    {
                        start: 'devblock_start',
                        end: 'devblock_end',
                        prefix: '/*',
                        suffix: '*/'
                    }]
            }
        });
        const output = stats.toJson({ source: true }).modules[0].source;

        assert.equal(output, EXPECTED_OUTPUT_COMPOUND_CASE);
    });
});
