const compiler = require('./test-compiler.js');
const assert = require('assert');

describe('test suite for the complex case', () => {
  const EXPECTED_OUTPUT = `
/* this comment should not be removed */
app.post('/update/:id', async (req, res) => {
    const id = req.params.id;
    const record = await repo.update(id, req.body);

    _logServer.log(id, record, req.params);

    res.send('Record Updated')
})`;

  describe('a complex case with a string parameter and an object parameter at the same time', () => {
    it('can remove the marked block and leave other code unchanged', async () => {
      const stats = await compiler('fixtures/complex-case.js', {
        options: {
          blocks: [
            'info',
            {
              start: 'stage_only_start',
              end: 'stage_only_stop',
              prefix: '/*',
              suffix: '*/',
            },
          ],
        },
      });
      const output = stats.toJson().modules[0].source;

      assert.equal(output, EXPECTED_OUTPUT);
    });
  });
});
