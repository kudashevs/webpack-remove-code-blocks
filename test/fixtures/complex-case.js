
/* this comment should not be removed */
app.post('/update/:id', async (req, res) => {
    /* info:start */
    console.log(`Connected Successfully.`);
    /* info:end */
    const id = req.params.id;
    const record = await repo.update(id, req.body);

    /* stage_only_start */
    console.log(`Record Updated: ${JSON.stringify(record, null, 2)}`);
    /* stage_only_stop */
    _logServer.log(id, record, req.params);

    res.send('Record Updated')
})